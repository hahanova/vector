import { useState } from "react";
import {
  Box,
  Button,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import {
  ButtonWrapper,
  InputWrapper,
  Output,
  TextField,
} from "./Vector.styled";

const isPowerOfTwo = (length: number) => {
  return length > 0 && (length & (length - 1)) === 0;
};

const binaryToDecimal = (binaryString: string): number => {
  return parseInt(binaryString, 2);
};

function bitwiseXORMatrix(binaryString: string) {
  // Convert binary string to an array of numbers
  let qVec = binaryString.split("").map((char) => parseInt(char, 2));
  let len = qVec.length;
  let mat1 = Array.from({ length: len }, (_, i) =>
    Array.from({ length: len }, (_, j) => qVec[i] ^ qVec[j])
  );
  return mat1;
}

function extractValues(valuesMatrix, indicesMatrix) {
  return valuesMatrix.map((row, rowIndex) =>
    row.map(
      (_, colIndex) => valuesMatrix[rowIndex][indicesMatrix[rowIndex][colIndex]]
    )
  );
}

// Example usage
const binaryString = "0101";
const decimalNumber = binaryToDecimal(binaryString);
console.log(decimalNumber); // Output: 5

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function getRecodingMatrix(n, init = [[0]], curI = 0) {
  if (curI === n) {
    return init;
  }

  let inc = init.map((row) => row.map((value) => value + (1 << curI))); // Equivalent to 2 ** curI
  let stacked = init.map((row, i) => [...row, ...inc[i]]);
  let invStacked = inc.map((row, i) => [...row, ...init[i]]);

  return getRecodingMatrix(n, [...stacked, ...invStacked], curI + 1);
}

export const Vector = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState(0);
  const [recodingMatrix, setRecodingMatrix] = useState();
  const [xorMatrix, setXorMatrix] = useState();
  const [testCoverage, setTestCoverage] = useState();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  console.log(2);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Check if the input contains only 0 and 1
    if (!/^[01]*$/.test(newValue)) {
      return;
    }

    setValue(newValue);

    if (!isPowerOfTwo(newValue.length)) {
      setError("The value should be a power of two, for example: 00100111");
      return;
    }

    setError("");
  };

  const handleGenerate = () => {
    const number = binaryToDecimal(value);
    const matrix = getRecodingMatrix(Math.log2(value.length));

    setRecodingMatrix(matrix);

    const matrix2 = bitwiseXORMatrix(value);
    setXorMatrix(matrix2);

    const matrix3 = extractValues(matrix2, matrix);
    setTestCoverage(matrix3);

    console.log({
      value,
      number,
      recodingMatrix: matrix,
      xorMatrix: matrix2,
      testCoverage: matrix3,
    });
  };
  // add color to 0 and 1
  // add more saturate color to higher value

  return (
    <>
      <InputWrapper>
        <TextField
          label="Enter vector"
          variant="outlined"
          value={value}
          placeholder="00100111"
          onChange={handleChange}
          error={!!error}
          helperText={error}
        />
        <ButtonWrapper>
          <Button
            variant="contained"
            disabled={Boolean(error || !value)}
            onClick={handleGenerate}
          >
            Generate
          </Button>
        </ButtonWrapper>
      </InputWrapper>
      <Output>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            aria-label="basic tabs example"
            centered
          >
            <Tab label="XOR Matrix" />
            <Tab label="Recoding Matrix" />
            <Tab label="Test Coverage" />
          </Tabs>
        </Box>
        <CustomTabPanel value={tab} index={0} style={{ overflowX: "auto" }}>
          {xorMatrix && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  {value.split("").map((char, index) => (
                    <TableCell key={index}>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        style={{ background: "black" }}
                      >
                        {char}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {xorMatrix.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        style={{ background: "black" }}
                      >
                        {value[rowIndex]}
                      </Typography>
                    </TableCell>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Typography variant="body1" fontWeight="bold">
                          {cell}
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={1} style={{ overflowX: "auto" }}>
          <Table>
            <TableBody>
              {recodingMatrix?.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={2} style={{ overflowX: "auto" }}>
          <Table>
            <TableBody>
              {testCoverage?.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CustomTabPanel>
      </Output>
    </>
  );
};
