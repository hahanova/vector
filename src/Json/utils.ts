// Convert binary string to decimal
export function str2decimal(s: string): number {
  return parseInt(s, 2);
}

// Generate truth table for n variables
export function truthTable(n: number): string[] {
  return Array.from({ length: 2 ** n }, (_, i) =>
    i.toString(2).padStart(n, "0")
  );
}

// Extract output from vector based on inputs
export function extractFromVec(inputs: number[], vec: string[]) {
  const noneIdx = inputs
    .map((val, i) => (val === -1 ? i : -1))
    .filter((i) => i !== -1);

  if (noneIdx.length > 0) {
    const outputs: string[] = [];

    for (const tentativeValues of truthTable(noneIdx.length)) {
      const newInputs = [...inputs];

      noneIdx.forEach((idx, i) => (newInputs[idx] = parseInt(tentativeValues[i])));

      const inputStr = newInputs.join("");

      outputs.push(vec[str2decimal(inputStr)]);
    }

    return new Set(outputs).size === 1 ? parseInt(outputs[0]) : -1;
  } else {
    const  inputStr = inputs.join("");

    return vec[str2decimal(inputStr)];
  }
}


// BaseComponent class
export class BaseComponent {
  call() {
    throw new Error("Method not implemented");
  }

  toString() {
    return this.id;
  }
}

// InputComponent class
export class InputComponent extends BaseComponent {
  constructor(value) {
    super();
    this.value = value;
  }
  call() {
    return this.value;
  }
}

// Scheme class
export class Scheme {
  constructor(inputs, outputs, components = null) {
    this.inputs = inputs;
    this.outputs = outputs;
    this.components = components;
    // Initialize modeling_vector with -1s (similar to numpy.ones with negative values)
    const length =
      (components ? Object.keys(components).length : 0) + inputs.length + 1;
    this.modeling_vector = new Array(length).fill(-1);
  }

  call(x) {
    this.setInput(x);
    return this.outputs
      .map((o) => {
        const component = this.components[o];
        const inputValues = component.inputs.map(
          (i) => this.modeling_vector[i]
        );
        return String(component.call(inputValues));
      })
      .join("");
  }

  fullSimulate() {
    const inputs = this.truthTable(this.inputs.length);
    const outputs = inputs.map((input) => this.call(input));
    return [inputs, outputs];
  }

  setInput(x) {
    const filteredX = x
      .split("")
      .filter((i) => i === "0" || i === "1")
      .map((i) => parseInt(i));
    this.inputs.forEach((inputIdx, i) => {
      this.modeling_vector[inputIdx] = filteredX[i] || 0;
    });
  }

  reset() {
    Object.values(this.components).forEach((c) => c.reset());
  }

  static fromDict(dict_) {
    if (Object.keys(dict_).length === 0) {
      throw new Error("Config is empty");
    }

    const scheme_inputs = [];
    const scheme_outputs = [];
    const components = {};

    for (let [id_, dict_element] of Object.entries(dict_.components)) {
      id_ = parseInt(id_);
      const element = new VectorComponent(
        id_,
        dict_element.vector,
        dict_element.is_input || false
      );

      if (dict_element.is_output) {
        components[id_] = element;
        scheme_outputs.push(id_);
      } else if (dict_element.is_input) {
        scheme_inputs.push(id_);
      } else {
        components[id_] = element;
      }
    }

    dict_.lines.forEach(([fromId, toId]) => {
      components[parseInt(toId)].inputs.push(parseInt(fromId));
    });

    return new Scheme(scheme_inputs, scheme_outputs, components);
  }

  simulationMatrixForInput(input) {
    this.setInput(input);

    // Simplified matrix representation using plain JS object
    const componentIds = Object.keys(this.components)
      .map((id) => parseInt(id))
      .sort((a, b) => a - b);
    const nLines = Math.max(...componentIds);

    // Create basic matrix structure
    const canvas = {
      data: {},
      columns: Array.from({ length: nLines }, (_, i) => i + 1),
      rows: [
        ...Array.from({ length: nLines }, (_, i) => i + 1),
        "sum V",
        "good",
        "fault",
      ],
    };

    // Initialize with identity matrix plus extra rows
    canvas.rows.forEach((row) => {
      canvas.data[row] = {};
      canvas.columns.forEach((col) => {
        if (row === col && typeof row === "number") {
          canvas.data[row][col] = 1;
        } else if (typeof row === "number") {
          canvas.data[row][col] = 0;
        } else {
          canvas.data[row][col] = "";
        }
      });
    });

    // Simulation logic
    for (let i = 0; i < 3; i++) {
      for (let [id_, c] of Object.entries(this.components)) {
        id_ = parseInt(id_);
        const inputValues = c.inputs.map((idx) => this.modeling_vector[idx]);
        this.modeling_vector[id_] = c.call(inputValues);
      }
    }

    // Fill good values
    this.modeling_vector.forEach((val, id_) => {
      if (id_ === 0) return;
      canvas.data["good"][id_] = val === -1 ? "x" : val;
    });
    // Rest of the simulation logic would need to be adapted based on VectorComponent implementation
    // This is a simplified version and would need the full VectorComponent class to be complete

    return canvas;
  }

  dataStructureCanvas() {
    const maxInputs = Math.max(
      ...Object.values(this.components)
        .filter((c) => c instanceof VectorComponent)
        .map((c) => c.inputs.length)
    );

    const componentIds = Object.keys(this.components)
      .map((id) => parseInt(id))
      .sort((a, b) => a - b);

    // Create canvas structure
    const columns = [
      ...Array(maxInputs ** 2)
        .fill()
        .map((_, i) => `D${i}`),
      ...Array(maxInputs ** 2)
        .fill()
        .map((_, i) => `Q${i}`),
      ...Array(maxInputs)
        .fill()
        .map((_, i) => `I${i}`),
      "OUTPUTS",
    ];

    const canvas = {
      data: {},
      columns: columns,
      rows: [...componentIds, "sum V", "good", "fault"],
    };

    // Initialize with empty strings
    canvas.rows.forEach((row) => {
      canvas.data[row] = {};
      columns.forEach((col) => (canvas.data[row][col] = ""));
    });

    // Fill data
    for (let [k, c] of Object.entries(this.components)) {
      k = parseInt(k);
      if (c instanceof VectorComponent && !c.is_input) {
        c.vector?.forEach((v, i) => {
          canvas.data[k][`Q${i}`] = parseInt(v);
        });
        c.d_vec?.forEach((v, i) => {
          canvas.data[k][`D${i}`] = parseInt(v);
        });
        c.inputs.forEach((v, i) => {
          canvas.data[k][`I${i}`] = v;
        });
      }
    }

    this.outputs.forEach((out, i) => {
      canvas.data[canvas.rows[i]]["OUTPUTS"] = out;
    });

    return canvas;
  }

  // Helper method (would typically be separate)
  truthTable(n) {
    const result = [];
    for (let i = 0; i < 2 ** n; i++) {
      result.push(i.toString(2).padStart(n, "0"));
    }
    return result;
  }
}

export class VectorComponent {
  constructor(id_, value = null, vector = null, is_input = false) {
    this.id_ = id_;
    this.inputs = [];
    this.vector = vector;
    this.d_vec = null;
    this.value = value;
    this.processed = false;
    this.is_input = is_input;
  }

  call(values = null) {
    if (this.is_input) {
      return this.value;
    }

    // Convert values to integers and extract output from vector
    const intValues = values.map((value) => parseInt(value));
    const output = this.extractFromVec(intValues, this.vector);
    this.value = output;
    return output;
  }

  fullSimulate() {
    const inputCount = Math.log2(this.vector.length);
    const inputs = this.truthTable(inputCount);
    const outputs = inputs.map((input) => this.call(input));
    return [inputs, outputs];
  }

  computeDVec(values = null) {
    const inputCount = this.inputs.length;
    const inputs = this.truthTable(inputCount);
    const outputs = this.vector;

    // Create table of inputs and outputs
    const table = inputs.map((input, i) => [
      ...input.split("").map(Number),
      outputs[i],
    ]);

    // Create test input array
    const testInput = [...values.map((v) => parseInt(v)), this.call(values)];

    // XOR operation between testInput and table
    const table2 = table.map((row) => row.map((val, i) => val ^ testInput[i]));

    // Sort based on all columns except the last one (output)
    const table3 = table2[0].map((_, colIndex) =>
      table2.map((row) => row[colIndex])
    ); // Transpose

    // Sort columns based on all rows except last (similar to np.lexsort)
    const sortedIndices = table3
      .slice(0, -1)
      .map((_, i) => i)
      .sort((a, b) => {
        for (let row = 0; row < table3.length - 1; row++) {
          if (table3[row][a] !== table3[row][b]) {
            return table3[row][b] - table3[row][a]; // Reverse order
          }
        }
        return 0;
      });

    // Apply sorting to last row to get d_vec
    this.d_vec = sortedIndices.map((i) => table3[table3.length - 1][i]);
  }

  toString() {
    const inputIds = this.inputs.map((i) => i.id_);

    return `${this.id_} Inputs: ${JSON.stringify(inputIds)}`;
  }

  // Helper methods
  truthTable(n) {
    const result = [];
    for (let i = 0; i < 2 ** n; i++) {
      result.push(i.toString(2).padStart(n, "0"));
    }
    return result;
  }

  extractFromVec(values, vector) {
    // Convert binary values array to decimal index
    const index = values.reduce(
      (acc, val, i) => acc + val * 2 ** (values.length - 1 - i),
      0
    );
    return vector[index];
  }
}

// const scheme = Scheme.fromDict(SCHEME);

// console.log("scheme", scheme);

// const output_table_obj = {};
// const component_names_obj = Object.keys(scheme.components)
//   .map((c) => parseInt(c))
//   .sort((a, b) => a - b);
// const inputs_obj = getTruthTable(scheme.inputs.length);
// // const output_components = [i for i in scheme.outputs];
// const output_components_obj = scheme.outputs.slice();

// console.log("inputs_obj", inputs_obj);

// const output1 = inputs_obj.map((input_, input_i) => {
//   const input_name = `${input_i}_${input_}`;
//   const simulation_matrix = scheme.simulationMatrixForInput(input_);

//   // console.log(1, simulation_matrix);

//   return {
//     input_name,
//     simulation_matrix,
//   };
// });

// console.log("output1", output1);
