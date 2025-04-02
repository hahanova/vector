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
