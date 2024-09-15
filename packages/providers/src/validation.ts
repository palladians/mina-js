import { z } from "zod";

export const switchChainRequestSchema = z.object({
	chainId: z.string(),
});

export type SwitchChainData = z.infer<typeof switchChainRequestSchema>;

export const addChainRequestSchema = z.object({
	url: z.string().url(),
	name: z.string(),
});

export type AddChainData = z.infer<typeof addChainRequestSchema>;
