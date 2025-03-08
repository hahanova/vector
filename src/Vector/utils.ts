export const isPowerOfTwo = (length: number) => {
  return length > 0 && (length & (length - 1)) === 0;
};

export const getBitwiseXORMatrix = (binaryString: string) => {
  const qVec = binaryString.split("").map((char) => parseInt(char, 2));
  const len = qVec.length;

  return Array.from({ length: len }, (_, i) =>
    Array.from({ length: len }, (_, j) => qVec[i] ^ qVec[j])
  );
};

export const extractValues = (
  valuesMatrix: number[][],
  indicesMatrix: number[][]
) => {
  return valuesMatrix.map((row: number[], rowIndex: number) =>
    row.map(
      (_: number, colIndex: number) =>
        valuesMatrix[rowIndex][indicesMatrix[rowIndex][colIndex]]
    )
  );
};

export const getRecodingMatrix = (n: number, init = [[0]], curI = 0): number[][] => {
  if (curI === n) {
    return init;
  }

  let inc = init.map((row) => row.map((value) => value + (1 << curI))); // Equivalent to 2 ** curI
  let stacked = init.map((row, i) => [...row, ...inc[i]]);
  let invStacked = inc.map((row, i) => [...row, ...init[i]]);

  return getRecodingMatrix(n, [...stacked, ...invStacked], curI + 1);
};


export const interpolateColor = (value: number) => {
  const startColor = { r: 51, g: 51, b: 51 }; // #333333
  const endColor = { r: 180, g: 156, b: 245 }; // #b49cf5

  const interpolate = (start: number, end: number, factor: number) => {
    return Math.round(start + (end - start) * factor);
  };

  const factor = value / 100; // Assuming value ranges from 0 to 100
  const r = interpolate(startColor.r, endColor.r, factor);
  const g = interpolate(startColor.g, endColor.g, factor);
  const b = interpolate(startColor.b, endColor.b, factor);

  return `rgb(${r}, ${g}, ${b})`;
};

const luminance = (r: number, g: number, b: number) => {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

export const getContrastRatio = (
  rgb1: { r: number; g: number; b: number },
  rgb2: { r: number; g: number; b: number }
) => {
  const lum1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = luminance(rgb2.r, rgb2.g, rgb2.b);

  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
};

export const createTestMap = (
  inputs: string[],
  recodedMat: number[][]
): string[][] => {
  const npInputs = inputs.map((i) => Array.from(i).map(Number));
  const invMat: number[][][] = npInputs.map((row) =>
    Array(npInputs.length).fill(row)
  );

  const updatedInvMat = invMat.map((row, i) =>
    row.map((cell, j) =>
      cell.map((subCell, k) => (npInputs[j][k] === 1 ? 1 - subCell : "."))
    )
  );

  return updatedInvMat.map((row, i) =>
    row.map((cell, j) => (recodedMat[i][j] === 0 ? "" : cell.join("")))
  );
};

export const getTruthTable = (n: number) => {
  return Array.from({ length: 2 ** n }, (_, i) =>
    i.toString(2).padStart(n, "0")
  );
};
