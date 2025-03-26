import type { z } from "zod";
import type {
	KlesiaRpcMethod,
	KlesiaRpcMethodSchema,
	KlesiaRpcResponseSchema,
	RpcError,
} from "./validation";

export type KlesiaRpcMethodType = z.infer<typeof KlesiaRpcMethod>;
export type KlesiaRpcRequestType = z.infer<typeof KlesiaRpcMethodSchema>;
export type KlesiaRpcResponseType = z.infer<typeof KlesiaRpcResponseSchema>;
export type RpcErrorType = z.infer<typeof RpcError>;
