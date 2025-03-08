import {
  createTestMap,
  getTruthTable,
  isPowerOfTwo,
  getBitwiseXORMatrix,
  extractValues,
  getRecodingMatrix,
  interpolateColor,
  getContrastRatio,
} from "./utils";

describe("isPowerOfTwo", () => {
  it("should return true for power of two numbers", () => {
    expect(isPowerOfTwo(2)).toBe(true);
    expect(isPowerOfTwo(4)).toBe(true);
    expect(isPowerOfTwo(8)).toBe(true);
  });

  it("should return false for non-power of two numbers", () => {
    expect(isPowerOfTwo(3)).toBe(false);
    expect(isPowerOfTwo(5)).toBe(false);
    expect(isPowerOfTwo(9)).toBe(false);
  });
});

describe("getBitwiseXORMatrix", () => {
  it("should return the correct XOR matrix", () => {
    expect(getBitwiseXORMatrix("1101")).toEqual([
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [1, 1, 0, 1],
      [0, 0, 1, 0],
    ]);
  });

  it("should return an empty matrix for an empty binary string", () => {
    expect(getBitwiseXORMatrix("")).toEqual([]);
  });
});

describe("extractValues", () => {
  it("should return the extracted values", () => {
    const valuesMatrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const indicesMatrix = [
      [0, 2, 1],
      [2, 1, 0],
      [1, 0, 2],
    ];
    expect(extractValues(valuesMatrix, indicesMatrix)).toEqual([
      [1, 3, 2],
      [6, 5, 4],
      [8, 7, 9],
    ]);
  });

  it("should return an empty matrix for empty input matrices", () => {
    expect(extractValues([], [])).toEqual([]);
  });
});

describe("getRecodingMatrix", () => {
  it("should return the correct recoding matrix", () => {
    expect(getRecodingMatrix(2)).toEqual([
      [0, 1, 2, 3],
      [1, 0, 3, 2],
      [2, 3, 0, 1],
      [3, 2, 1, 0],
    ]);
  });

  it("should return an empty matrix for n = 0", () => {
    expect(getRecodingMatrix(0)).toEqual([[0]]);
  });
});

describe("interpolateColor", () => {
  it("should return the interpolated color", () => {
    expect(interpolateColor(50)).toBe("rgb(116, 104, 148)");
    expect(interpolateColor(0)).toBe("rgb(51, 51, 51)");
    expect(interpolateColor(100)).toBe("rgb(180, 156, 245)");
  });
});

describe("getContrastRatio", () => {
  it("should return the correct contrast ratio", () => {
    const rgb1 = { r: 255, g: 255, b: 255 };
    const rgb2 = { r: 0, g: 0, b: 0 };
    expect(getContrastRatio(rgb1, rgb2)).toBe(21);
  });
});

describe("createTestMap", () => {
  it("should return the correct test map", () => {
    const inputs = ["101", "010", "111"];
    const recodedMat = [
      [0, 1, 0],
      [1, 0, 1],
      [1, 1, 1],
    ];
    expect(createTestMap(inputs, recodedMat)).toEqual([
      ["", ".1.", ""],
      ["1.1", "", "101"],
      ["0.0", ".0.", "000"],
    ]);
  });

  it("should return an empty test map for empty inputs", () => {
    const inputs = [] as any;
    const recodedMat = [[]];

    expect(createTestMap(inputs, recodedMat)).toEqual([]);
  });
});

describe("getTruthTable", () => {
  it("should return the correct truth table", () => {
    expect(getTruthTable(3)).toEqual([
      "000",
      "001",
      "010",
      "011",
      "100",
      "101",
      "110",
      "111",
    ]);
  });

  it("should return an empty truth table for n = 0", () => {
    expect(getTruthTable(0)).toEqual(["0"]);
  });
});
