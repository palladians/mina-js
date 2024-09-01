export const buildResponse = (data: unknown) => ({
	jsonrpc: "2.0",
	result: data,
});
