import { z } from "zod";
import superjson from "superjson";

const DEFAULT_TIMEOUT = 60000;

export const RequestSchema = z.object({
  method: z.string(),
  params: z.array(z.string()).optional(),
});

type RequestParams = z.infer<typeof RequestSchema>;

export const ResponseSchema = z
  .object({
    id: z.string(),
    result: z.any().optional(),
    error: z.string().optional(),
  })
  .strict();

type Response = z.infer<typeof ResponseSchema>;

export type RequestFn = (params: RequestParams) => Promise<Response>;

export const createRpc = ({
  worker,
  timeout,
}: {
  worker: Worker;
  timeout?: number;
}) => {
  const request: RequestFn = async ({ method, params }) => {
    let resolved = false;
    return new Promise((resolve, reject) => {
      console.log('>>>M', method, params)
      setTimeout(() => {
        if (resolved) return;
        return reject(new Error("[WorkerRPC] Timeout reached."));
      }, timeout ?? DEFAULT_TIMEOUT);
      const responseListener = (event: MessageEvent) => {
        resolved = true;
        worker.removeEventListener("message", responseListener);
        const data = superjson.parse(event.data);
        const response = ResponseSchema.parse(data);
        if (response.error)
          return reject(new Error(`[WorkerRPC] ${response.error}`));
        return resolve(response);
      };
      worker.addEventListener("message", responseListener);
      worker.postMessage({ method, params });
    });
  };
  return {
    request,
  };
};

type Method = (params: string[]) => Promise<unknown>;
type MethodsMap = Record<string, Method>;

const respond = (data: unknown) => postMessage(superjson.stringify(data))

export const createRpcHandler = ({ methods }: { methods: MethodsMap }) => {
  const methodKeys = Object.keys(methods);
  if (methodKeys.length === 0) throw new Error("No methods provided.");
  const MethodEnum = z.enum(['error', ...methodKeys]);
  const ExtendedRequestSchema = RequestSchema.extend({
    method: MethodEnum,
  }).strict();
  const ExtendedResponseSchema = ResponseSchema.extend({
    id: MethodEnum,
  }).strict();
  const messageHandler = async (event: MessageEvent) => {
    try {
      const action = ExtendedRequestSchema.parse(event.data)
      const callable = methods[action.method]
      if (!callable) throw new Error(`Method "${action.method}" not found.`);
      const result = await callable(action.params ?? []);
      const parsedResult = ExtendedResponseSchema.parse({
        id: action.method,
        result,
      });
      return respond(parsedResult);
    // biome-ignore lint/suspicious/noExplicitAny: Error handling
    } catch (error: any) {
      return respond(ExtendedResponseSchema.parse({
        id: 'error',
        error: `[WorkerRPC] ${error.message}`,
      }));
    }
  };
  return { messageHandler };
};
