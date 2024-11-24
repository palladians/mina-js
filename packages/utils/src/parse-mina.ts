import { parseUnits } from "./parse-units";

/**
 * Parse a mina value to a micro-Mina value.
 */
export const parseMina = (minaValue: string) => {
	return parseUnits(minaValue, 9);
};
