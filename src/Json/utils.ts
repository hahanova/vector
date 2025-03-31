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

      noneIdx.forEach(
        (idx, i) => (newInputs[idx] = parseInt(tentativeValues[i]))
      );

      const inputStr = newInputs.join("");

      outputs.push(vec[str2decimal(inputStr)]);
    }

    return new Set(outputs).size === 1 ? parseInt(outputs[0]) : -1;
  } else {
    const inputStr = inputs.join("");

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
export class Scheme {
  constructor(inputs, outputs, components = null) {
    this.inputs = inputs; // Array of input indices
    this.outputs = outputs; // Array of output indices
    this.components = components || {}; // Object mapping IDs to components
    this.modeling_vector = new Array(
      (components ? Object.keys(components).length : 0) + inputs.length + 1
    ).fill(-1); // Mimics -np.ones
  }

  // Callable method to process input string and return output
  call(x) {
    this.set_input(x);
    return this.outputs
      .map((o) =>
        this.components[o](this.modeling_vector[this.components[o].inputs])
      )
      .join("");
  }

  // Full simulation with truth table
  full_simulate() {
    const inputs = truth_table(this.inputs.length); // Assuming truth_table is defined elsewhere
    const outputs = inputs.map((input) => this.call(input));
    return [inputs, outputs];
  }

  // Set input values in modeling_vector
  set_input(x) {
    const filteredX = x
      .split("")
      .filter((i) => i === "0" || i === "1")
      .map((i) => parseInt(i));
    this.inputs.forEach((inputIdx, i) => {
      this.modeling_vector[inputIdx] = filteredX[i];
    });
  }

  // Reset all components
  reset() {
    Object.values(this.components).forEach((c) => c.reset());
  }

  // Static method to create Scheme from a dictionary
  static from_dict(dict_) {
    if (Object.keys(dict_).length === 0) throw new Error("Config is empty");

    const scheme_inputs = [];
    const scheme_outputs = [];
    const components = {};

    for (let [id_, dict_element] of Object.entries(dict_.components)) {
      id_ = parseInt(id_);
      const element = new VectorComponent(
        id_,
        null,
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

  // Simulation matrix for a given input
  simulationMatrixForInput(input) {
    this.set_input(input);

    const componentNames = Object.keys(this.components)
      .map((c) => parseInt(c))
      .sort((a, b) => a - b);
    const nLines = Math.max(...componentNames);

    // Initialize canvas as a 2D object
    let canvas = {};
    const indexLabels = [...Array(nLines).keys()]
      .map((i) => i + 1)
      .concat(["sum V", "good", "fault"]);
    const columnLabels = [...Array(nLines).keys()].map((i) => i + 1);

    for (let row of indexLabels) {
      canvas[row] = {};
      for (let col of columnLabels) {
        if (row === col && typeof row === "number") {
          canvas[row][col] = 1;
        } else if (typeof row === "number") {
          canvas[row][col] = 0;
        } else {
          canvas[row][col] = 0;
        }
      }
    }

    const outputComponents = [...this.outputs];

    // Simulate 3 iterations
    for (let i = 0; i < 3; i++) {
      for (let [id_, c] of Object.entries(this.components)) {
        id_ = parseInt(id_);
        this.modeling_vector[id_] = c.call(
          c.inputs.map((a) => this.modeling_vector[a])
        );
      }
    }

    // Populate 'good' row and compute values
    this.modeling_vector.forEach((val, id_) => {
      if (id_ === 0) return;
      if (val === -1) val = "x";
      canvas["good"][id_] = val;
      if (id_ in this.components) {
        const c = this.components[id_];
        if (Math.min(...c.inputs.map((a) => this.modeling_vector[a])) >= 0) {
          // debugger;
          c.computeDVec(c.inputs.map((a) => this.modeling_vector[a]));
          const inputs_i = c.inputs;

          for (let subId = 1; subId < this.modeling_vector.length; subId++) {
            if (subId === id_) continue;
            const inputs = inputs_i.map((input) => canvas[input][subId]);
            const output = extractFromVec(inputs, c.d_vec); // Placeholder function
            canvas[id_][subId] = Number(output);
          }
        }
      }
    });

    // Compute 'sum V' row
    // Compute 'sum V' row
    canvas["sum V"] = columnLabels.map((col) => {
      const columnValues = outputComponents.map((row) => canvas[row][col]);
      return columnValues.reduce((a, b) => a || b, 0) ? 1 : 0;
    });
    columnLabels.forEach((col) => {
      if (canvas["sum V"][col] === 0) canvas["sum V"][col] = "";
    });

    // Compute 'fault' row
    for (let id_ = 1; id_ < this.modeling_vector.length; id_++) {
      if (canvas["sum V"][id_] === 1 && canvas["good"][id_] !== "x") {
        canvas["fault"][id_] = 1 - canvas["good"][id_];
      } else {
        canvas["fault"][id_] = "";
      }
    }

    return canvas;
  }

  // Data structure canvas
  dataStructureCanvas() {
    const maxInputs = Math.max(
      ...Object.values(this.components)
        .filter((c) => c instanceof VectorComponent)
        .map((c) => c.inputs.length)
    );
    const componentNames = Object.keys(this.components)
      .map((c) => parseInt(c))
      .sort((a, b) => a - b);

    // Initialize canvas
    const canvas = {};
    const columns = [
      ...Array(maxInputs ** 2)
        .keys()
        .map((i) => `D${i}`),
      ...Array(maxInputs ** 2)
        .keys()
        .map((i) => `Q${i}`),
      ...Array(maxInputs)
        .keys()
        .map((i) => `I${i}`),
      "OUTPUTS",
    ];
    const indexLabels = [...componentNames, "sum V", "good", "fault"];

    for (let row of indexLabels) {
      canvas[row] = {};
      for (let col of columns) {
        canvas[row][col] = "";
      }
    }

    // Populate canvas
    for (let [k, c] of Object.entries(this.components)) {
      k = parseInt(k);
      if (c instanceof VectorComponent && !c.is_input) {
        c.vector.forEach((v, i) => {
          canvas[k][`Q${i}`] = parseInt(v);
        });
        if (c.d_vec !== null) {
          c.d_vec.forEach((v, i) => {
            canvas[k][`D${i}`] = parseInt(v);
          });
        }
        c.inputs.forEach((v, i) => {
          canvas[k][`I${i}`] = v;
        });
      }
    }

    this.outputs.forEach((output, i) => {
      canvas[indexLabels[i]]["OUTPUTS"] = output;
    });

    return canvas;
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
    const intValues = values?.map((value) => parseInt(value));
    const output = this.extractFromVec(intValues, this.vector);
    this.value = Number(output);

    return Number(output);
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
      Number(outputs[i]),
    ]);

    // Create test input array
    const testInput = [...values?.map((v) => parseInt(v)), this.call(values)];

    // XOR operation between testInput and table
    const table2 = table.map((row) => row.map((val, i) => val ^ testInput[i]));

    const table3 = table2.slice().sort((a, b) => {
      for (let i = 0; i < 2; i++) {
        if (a[i] !== b[i]) return a[i] - b[i];
      }
      return 0;
    });

    // Sort columns based on all rows except last (similar to np.lexsort)
    this.d_vec = table3.map((row) => row[row.length - 1]);
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
    if (Array.isArray(vector)) vector = vector.join("");

    // Convert binary values array to decimal index
    const index = values?.reduce(
      (acc, val, i) => acc + val * 2 ** (values.length - 1 - i),
      0
    );
    return vector[index];
  }
}
