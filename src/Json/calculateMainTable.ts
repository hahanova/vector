import { getTruthTable } from "../Vector/utils";
import { Scheme } from "./utils";

export function transformToMatrix(data) {
  const sortedKeys = Object.keys(data).sort();

  // Предполагаем, что во всех fault одинаковое количество столбцов
  const columnCount = Object.keys(data[sortedKeys[0]].fault).length;

  // Создаем массивы по колонкам
  const result = Array.from({ length: columnCount }, () => []);

  // Заполняем результат по столбцам
  sortedKeys.forEach((key) => {
    const fault = data[key].fault;
    for (let i = 0; i < columnCount; i++) {
      result[i].push(fault[(i + 1).toString()]);
    }
  });

  return result;
}

export const calcIntegral = ({ falseSimulationMatrix, scheme }) => {
  const integral = [];

  const transformed = transformToMatrix(falseSimulationMatrix);

  for (let j = 0; j < scheme.modeling_vector.length - 1; j++) {
    // Create a vector indicating non-duplicated values
    let vec = transformed[j].map((item, index, arr) => {
      return arr.indexOf(item) === index;
    });

    // Set empty string positions to false
    vec = vec.map((value, index) => {
      return transformed[j][index] === "" ? false : value;
    });

    // Calculate cumulative sum
    integral[j] = vec.reduce((acc, curr, idx) => {
      if (idx === 0) return [curr ? 1 : 0];
      return [...acc, (curr ? 1 : 0) + acc[idx - 1]];
    }, []);
  }

  return integral;
};

export const calcFormula = ({ data, scheme }) => {
  const result = [];

  // Function to extract a column from a 2D array
  const getColumn = (matrix, colIndex) => {
    return matrix.map((row) => row[colIndex]);
  };

  // Iterate over the columns
  for (let j = 0; j < data[0].length; j++) {
    const column = getColumn(data, j);

    const value = (
      column.reduce((a, b) => a + b, 0) /
      ((scheme.modeling_vector.length - 1) * 2)
    ).toFixed(2);

    result.push(value);
  }

  return result;
};

const countOnes = (obj: Record<string, number | string>): number => {
  return Object.values(obj).reduce((count, value) => {
    return value === 1 ? (count as number) + 1 : count;
  }, 0);
};

export const countQ = (sumV: Record<string, number | string>) => {
  return (countOnes(sumV) / (Object.keys(sumV).length * 2)).toFixed(2);
};

export const getValues = async (parsedJson) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const scheme = Scheme.from_dict(parsedJson);
      const inputs_obj = getTruthTable(scheme.inputs.length);

      const output2 = {};
      const falseSimulationMatrix = {};
      const dVec = {};
      const q = {};

      inputs_obj.forEach((input) => {
        const acc = {};
        acc[input] = scheme.simulationMatrixForInput(input);
        dVec[input] = JSON.parse(JSON.stringify(scheme?.components));
        q[input] = countQ(acc[input]["sum V"]);

        if (!falseSimulationMatrix[input]) {
          falseSimulationMatrix[input] = {};
        }

        falseSimulationMatrix[input]["fault"] = acc[input]["fault"];
        falseSimulationMatrix[input]["modeling"] = acc[input]["good"];

        Object.assign(output2, acc);
      });

      const integral = calcIntegral({
        scheme,
        falseSimulationMatrix,
      });

      const superIntegral = calcFormula({ data: integral, scheme });

      resolve({
        superIntegral,
        inputs_obj,
        output2,
        q,
        falseSimulationMatrix,
        scheme,
        dVec,
      });
    }, 1000);
  });
};
