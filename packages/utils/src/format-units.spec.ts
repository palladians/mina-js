import { expect, it } from "bun:test";

import { formatUnits } from "./format-units";

it("converts value to number", () => {
	expect(formatUnits(69n, 0)).toEqual("69");
	expect(formatUnits(69n, 5)).toEqual("0.00069");
	expect(formatUnits(690n, 1)).toEqual("69");
	expect(formatUnits(1300000n, 5)).toEqual("13");
	expect(formatUnits(4200000000000n, 10)).toEqual("420");
	expect(formatUnits(20000000000n, 9)).toEqual("20");
	expect(formatUnits(40000000000000000000n, 18)).toEqual("40");
	expect(formatUnits(10000000000000n, 18)).toEqual("0.00001");
	expect(formatUnits(12345n, 4)).toEqual("1.2345");
	expect(formatUnits(12345n, 4)).toEqual("1.2345");
	expect(formatUnits(6942069420123456789123450000n, 18)).toEqual(
		"6942069420.12345678912345",
	);
	expect(
		formatUnits(
			694212312312306942012345444446789123450000000000000000000000000000000n,
			50,
		),
	).toEqual("6942123123123069420.1234544444678912345");
	expect(formatUnits(-690n, 1)).toEqual("-69");
	expect(formatUnits(-1300000n, 5)).toEqual("-13");
	expect(formatUnits(-4200000000000n, 10)).toEqual("-420");
	expect(formatUnits(-20000000000n, 9)).toEqual("-20");
	expect(formatUnits(-40000000000000000000n, 18)).toEqual("-40");
	expect(formatUnits(-12345n, 4)).toEqual("-1.2345");
	expect(formatUnits(-12345n, 4)).toEqual("-1.2345");
	expect(formatUnits(-6942069420123456789123450000n, 18)).toEqual(
		"-6942069420.12345678912345",
	);
	expect(
		formatUnits(
			-694212312312306942012345444446789123450000000000000000000000000000000n,
			50,
		),
	).toEqual("-6942123123123069420.1234544444678912345");
});
