import { formatUnits } from "./format-units";

/**
 * Formats micro-Mina (1e-6 Mina) to Mina.
 */
export function formatMina(value: bigint) {
	return formatUnits(value, 9);
}
