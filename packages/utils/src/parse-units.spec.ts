import { expect, it } from "bun:test";

import { parseUnits } from "./parse-units";

it("converts number to unit of a given length", () => {
	expect(parseUnits("69", 1)).toEqual(690n);
	expect(parseUnits("13", 5)).toEqual(1300000n);
	expect(parseUnits("420", 10)).toEqual(4200000000000n);
	expect(parseUnits("20", 9)).toEqual(20000000000n);
	expect(parseUnits("40", 18)).toEqual(40000000000000000000n);
	expect(parseUnits("1.2345", 4)).toEqual(12345n);
	expect(parseUnits("1.0045", 4)).toEqual(10045n);
	expect(parseUnits("1.2345000", 4)).toEqual(12345n);
	expect(parseUnits("6942069420.12345678912345", 18)).toEqual(
		6942069420123456789123450000n,
	);
	expect(parseUnits("6942069420.00045678912345", 18)).toEqual(
		6942069420000456789123450000n,
	);
	expect(parseUnits("6942123123123069420.1234544444678912345", 50)).toEqual(
		694212312312306942012345444446789123450000000000000000000000000000000n,
	);
	expect(parseUnits("-69", 1)).toEqual(-690n);
	expect(parseUnits("-1.2345", 4)).toEqual(-12345n);
	expect(parseUnits("-6942069420.12345678912345", 18)).toEqual(
		-6942069420123456789123450000n,
	);
	expect(parseUnits("-6942123123123069420.1234544444678912345", 50)).toEqual(
		-694212312312306942012345444446789123450000000000000000000000000000000n,
	);
});

it("converts when decimals === 0", () => {
	expect(parseUnits("69.2352112312312451512412341231", 0)).toEqual(69n);
	expect(parseUnits("69.5952141234124125231523412312", 0)).toEqual(70n);
	expect(parseUnits("12301000000000000020000", 0)).toEqual(
		12301000000000000020000n,
	);
	expect(parseUnits("12301000000000000020000.123", 0)).toEqual(
		12301000000000000020000n,
	);
	expect(parseUnits("12301000000000000020000.5", 0)).toEqual(
		12301000000000000020001n,
	);
	expect(parseUnits("99999999999999999999999.5", 0)).toEqual(
		100000000000000000000000n,
	);
});

it("converts when decimals < fraction length", () => {
	expect(parseUnits("69.23521", 0)).toEqual(69n);
	expect(parseUnits("69.56789", 0)).toEqual(70n);
	expect(parseUnits("69.23521", 1)).toEqual(692n);
	expect(parseUnits("69.23521", 2)).toEqual(6924n);
	expect(parseUnits("69.23221", 2)).toEqual(6923n);
	expect(parseUnits("69.23261", 3)).toEqual(69233n);
	expect(parseUnits("999999.99999", 3)).toEqual(1000000000n);
	expect(parseUnits("699999.99999", 3)).toEqual(700000000n);
	expect(parseUnits("699999.98999", 3)).toEqual(699999990n);
	expect(parseUnits("699959.99999", 3)).toEqual(699960000n);
	expect(parseUnits("699099.99999", 3)).toEqual(699100000n);
	expect(parseUnits("100000.000999", 3)).toEqual(100000001n);
	expect(parseUnits("100000.990999", 3)).toEqual(100000991n);
	expect(parseUnits("69.00221", 3)).toEqual(69002n);
	expect(parseUnits("1.0536059576998882", 7)).toEqual(10536060n);
	expect(parseUnits("1.0053059576998882", 7)).toEqual(10053060n);
	expect(parseUnits("1.0000000900000000", 7)).toEqual(10000001n);
	expect(parseUnits("1.0000009900000000", 7)).toEqual(10000010n);
	expect(parseUnits("1.0000099900000000", 7)).toEqual(10000100n);
	expect(parseUnits("1.0000092900000000", 7)).toEqual(10000093n);
	expect(parseUnits("1.5536059576998882", 7)).toEqual(15536060n);
	expect(parseUnits("1.0536059476998882", 7)).toEqual(10536059n);
	expect(parseUnits("1.4545454545454545", 7)).toEqual(14545455n);
	expect(parseUnits("1.1234567891234567", 7)).toEqual(11234568n);
	expect(parseUnits("1.8989898989898989", 7)).toEqual(18989899n);
	expect(parseUnits("9.9999999999999999", 7)).toEqual(100000000n);
	expect(parseUnits("0.0536059576998882", 7)).toEqual(536060n);
	expect(parseUnits("0.0053059576998882", 7)).toEqual(53060n);
	expect(parseUnits("0.0000000900000000", 7)).toEqual(1n);
	expect(parseUnits("0.0000009900000000", 7)).toEqual(10n);
	expect(parseUnits("0.0000099900000000", 7)).toEqual(100n);
	expect(parseUnits("0.0000092900000000", 7)).toEqual(93n);
	expect(parseUnits("0.0999999999999999", 7)).toEqual(1000000n);
	expect(parseUnits("0.0099999999999999", 7)).toEqual(100000n);
	expect(parseUnits("0.00000000059", 9)).toEqual(1n);
	expect(parseUnits("0.0000000003", 9)).toEqual(0n);
	expect(parseUnits("69.00000000000", 9)).toEqual(69000000000n);
	expect(parseUnits("69.00000000019", 9)).toEqual(69000000000n);
	expect(parseUnits("69.00000000059", 9)).toEqual(69000000001n);
	expect(parseUnits("69.59000000059", 9)).toEqual(69590000001n);
	expect(parseUnits("69.59000002359", 9)).toEqual(69590000024n);
});
