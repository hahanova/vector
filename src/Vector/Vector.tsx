import { useState } from "react";
import {
  Box,
  Button,
  Tab,
  TableBody,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import {
  ButtonWrapper,
  CustomTableCell,
  InputWrapper,
  Output,
  StyledTableCell,
  Table,
  TableCell,
  TextField,
  ZeroTableCell,
} from "./Vector.styled";
import {
  getBitwiseXORMatrix,
  extractValues,
  getRecodingMatrix,
  isPowerOfTwo,
  createTestMap,
  getTruthTable,
} from "./utils";
import { TabPanel } from "../components";

export const Vector = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState(0);
  const [recodingMatrix, setRecodingMatrix] = useState<number[][]>();
  const [xorMatrix, setXorMatrix] = useState<number[][]>();
  const [deductiveMatrix, setDeductiveMatrix] = useState<number[][]>();
  const [testCoverage, setTestCoverage] = useState<number[][]>();
  const [savedValue, setSavedValue] = useState("");
  const [truthTable, setTruthTable] = useState<string[]>([]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

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
    setSavedValue(value);

    const recordingMatrix = getRecodingMatrix(Math.log2(value.length));
    const xorMatrix = getBitwiseXORMatrix(value);
    const deductiveMatrix = extractValues(xorMatrix, recordingMatrix);
    const truthTable = getTruthTable(Math.log2(value.length));
    const testCoverage = createTestMap(truthTable, deductiveMatrix);

    setRecodingMatrix(recordingMatrix);
    setXorMatrix(xorMatrix);
    setDeductiveMatrix(deductiveMatrix);
    setTruthTable(truthTable);
    setTestCoverage(testCoverage);
  };

  return (
    <>
      <InputWrapper>
        <TextField
          label="Enter vector"
          variant="outlined"
          value={value}
          onChange={handleChange}
          error={!!error}
          helperText={error}
          onKeyDown={({ key }: React.KeyboardEvent<HTMLInputElement>) => {
            if (key === "Enter") handleGenerate();
          }}
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
            <Tab label="Deductive Matrix" />
            <Tab label="Test Coverage" />
          </Tabs>
        </Box>
        <TabPanel value={tab} index={0}>
          {xorMatrix && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  {savedValue.split("").map((char, index) => (
                    <StyledTableCell align="center" key={index} isThin>
                      {char}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {xorMatrix.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <StyledTableCell align="center">
                      {savedValue[rowIndex]}
                    </StyledTableCell>
                    {row.map((cell, cellIndex) =>
                      cell === 1 ? (
                        <TableCell align="center" key={cellIndex}>
                          <Typography variant="body1">{cell}</Typography>
                        </TableCell>
                      ) : (
                        <ZeroTableCell align="center" key={cellIndex}>
                          <Typography variant="body1">{cell}</Typography>
                        </ZeroTableCell>
                      )
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabPanel>
        <TabPanel value={tab} index={1}>
          {recodingMatrix && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  {truthTable.map((char, index) => (
                    <StyledTableCell align="center" key={`${char}-${index}`}>
                      {char}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {recodingMatrix.map((row, rowIndex) => (
                  <TableRow key={truthTable[rowIndex]}>
                    <StyledTableCell align="center">
                      {truthTable[rowIndex]}
                    </StyledTableCell>
                    {row.map((cell, cellIndex) => (
                      <CustomTableCell
                        align="center"
                        key={cellIndex}
                        value={cell}
                      >
                        {cell}
                      </CustomTableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabPanel>
        <TabPanel value={tab} index={2}>
          {deductiveMatrix && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  {truthTable.map((char, index) => (
                    <StyledTableCell align="center" key={`${char}-${index}`}>
                      {char}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {deductiveMatrix.map((row, rowIndex) => (
                  <TableRow key={truthTable[rowIndex]}>
                    <StyledTableCell align="center">
                      {truthTable[rowIndex]}
                    </StyledTableCell>
                    {row.map((cell, cellIndex) =>
                      cell === 1 ? (
                        <TableCell align="center" key={cellIndex}>
                          {cell}
                        </TableCell>
                      ) : (
                        <ZeroTableCell align="center" key={cellIndex}>
                          {cell}
                        </ZeroTableCell>
                      )
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabPanel>
        <TabPanel value={tab} index={3}>
          {testCoverage && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  {truthTable.map((char, index) => (
                    <StyledTableCell align="center" key={`${char}-${index}`}>
                      {char}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {testCoverage.map((row, rowIndex) => (
                  <TableRow key={truthTable[rowIndex]}>
                    <StyledTableCell align="center">
                      {truthTable[rowIndex]}
                    </StyledTableCell>
                    {row.map((cell, cellIndex) =>
                      cell ? (
                        <TableCell
                          align="center"
                          key={`${truthTable[rowIndex]}-${cellIndex}`}
                        >
                          <Typography variant="body1">{cell}</Typography>
                        </TableCell>
                      ) : (
                        <ZeroTableCell
                          align="center"
                          key={`${truthTable[rowIndex]}-${cellIndex}`}
                        >
                          <Typography variant="body1">{cell}</Typography>
                        </ZeroTableCell>
                      )
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabPanel>
      </Output>
    </>
  );
};
