import { Client, cacheExchange, fetchExchange } from "@urql/core";

export const getNodeClient = (graphqlEndpoint: string) => {
	return new Client({
		url: graphqlEndpoint,
		exchanges: [cacheExchange, fetchExchange],
	});
};
