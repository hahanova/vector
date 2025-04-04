import { useLayoutEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormLabel,
  Tab,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  ButtonWrapper,
  ErrorMessage,
  LabelWrapper,
  Textarea,
  Wrapper,
} from "./Json.styled";
import { getTruthTable } from "../Vector/utils";

import { Output, StyledTableCell } from "../Vector/Vector.styled";
import { BinaryCell, GradientCell, TabPanel, TableCell } from "../components";
import CONFIGURATION_EXAMPLE from "./configuration-example.json";
import { Scheme } from "./utils";
// import { getIntegral } from "./calculateMainTable";
import { FalseSimulationMatrix } from "./FalseSimulationMatrix";

const customColumnNames = [
  { label: "Input", colSpan: 2 },
  { label: "I-set", tooltip: "Input Set" },
  { label: "LV", tooltip: "Logic Vector" },
  { label: "DV", tooltip: "Deductive Vector" },
];

export const Json = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState(0);
  const [truthTable, setTruthTable] = useState<string[]>([]);
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const validateAndParseJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);

      if (
        typeof parsed !== "object" ||
        parsed === null ||
        Array.isArray(parsed)
      ) {
        throw new Error("Input is not a valid JSON object");
      }

      setError("");
      return parsed;
    } catch (error) {
      setError((error as Error).message);
      return null;
    }
  };

  useLayoutEffect(() => {
    if (truthTable) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  }, [truthTable]);

  useLayoutEffect(() => {
    if (shouldScrollToTop) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      setShouldScrollToTop(false);
    }
  }, [shouldScrollToTop]);
  const [output2, setOutput2] = useState<any>([]);
  const [dVec] = useState<any>({});
  const [falseSimulationMatrix] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 0));
    const parsedJson = validateAndParseJson(value);

    if (!parsedJson) return;

    const formattedJson = JSON.stringify(parsedJson, null, 2);

    setValue(formattedJson);

    try {
      const scheme = Scheme.from_dict(parsedJson);
      const inputs_obj = getTruthTable(scheme.inputs.length);
      const output2 = inputs_obj.reduce((acc, input) => {
        acc[input] = scheme.simulationMatrixForInput(input);
        dVec[input] = JSON.parse(JSON.stringify(scheme?.components));
        // falseSimulationMatrix[input] = []

        // for (let c = 1; c < scheme.modeling_vector.length; c++) {
        // Initialize row if it doesn't exist
        if (!falseSimulationMatrix[input]) {
          falseSimulationMatrix[input] = {};
        }

        // Set values similar to pandas .at[]
        falseSimulationMatrix[input]["fault"] = acc[input]["fault"];
        falseSimulationMatrix[input]["modeling"] = acc[input]["good"];

        return acc;
      }, {});

      // Object.keys(falseSimulationMatrix)
      // getIntegral = ({ scheme, false_simulation_matrix })

      // const integral = {};

      // for (let j = 1; j < scheme.modeling_vector.length; j++) {
      //   let k = `F${j}`;

      //   // Create a vector indicating non-duplicated values
      //   let vec = falseSimulationMatrix[k].map((item, index, arr) => {
      //     return arr.indexOf(item) === index;
      //   });

      //   // Object.keys(temp1).map(a => temp1[a].fault[1])

      //   // Set empty string positions to false
      //   vec = vec.map((value, index) => {
      //     return falseSimulationMatrix[k][index] === "" ? false : value;
      //   });

      //   // Calculate cumulative sum
      //   integral[k] = vec.reduce((acc, curr, idx) => {
      //     if (idx === 0) return [curr ? 1 : 0];
      //     return [...acc, (curr ? 1 : 0) + acc[idx - 1]];
      //   }, []);
      // }

      setTruthTable(inputs_obj);

      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

      console.log("Output:", {
        parsedJson,
        scheme,
        inputs_obj,
        output2,
        dVec,
        falseSimulationMatrix,
        truthTable,
      });

      setOutput2(output2);
      setIsLoading(false);
    } catch (error) {
      setError("This JSON cannot be processed, try with another one");
      console.error(error);
    }
  };

  return (
    <Wrapper>
      <LabelWrapper>
        <FormLabel htmlFor="configuration">Enter circuit:</FormLabel>
        <Button
          onClick={() => {
            if (error) {
              setError("");
            }

            setShouldScrollToTop(true);
            setValue(JSON.stringify(CONFIGURATION_EXAMPLE, null, 2));
          }}
        >
          Load Example
        </Button>
      </LabelWrapper>
      <Textarea
        id="configuration"
        value={value}
        onChange={({ target }) => {
          if (error) {
            setError("");
          }

          setValue(target.value);
        }}
        hasError={Boolean(error)}
        aria-label="Enter circuit"
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <ButtonWrapper>
        <Button onClick={handleGenerate} variant="contained">
          Generate
        </Button>
      </ButtonWrapper>
      {isLoading && (
        <Box style={{ textAlign: "center" }}>
          <CircularProgress />
          <Typography>We are creating a vector simulation...</Typography>
        </Box>
      )}
      <FalseSimulationMatrix falseSimulationMatrix={falseSimulationMatrix} />
      <Output>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            aria-label="Scheme Configurations"
            variant="scrollable"
            scrollButtons="auto"
          >
            {truthTable.map((input) => (
              <Tab label={input} key={input} />
            ))}
          </Tabs>
        </Box>
        {truthTable.map((input, i) => (
          <TabPanel value={tab} index={i} key={input}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  {Object.keys(output2?.[input]?.["1"] || {}).map(
                    (char, index) => (
                      <StyledTableCell align="center" key={index} isThin>
                        {char}
                      </StyledTableCell>
                    )
                  )}
                  {customColumnNames.map(({ label, tooltip, colSpan = 1 }) => (
                    <Tooltip
                      title={tooltip}
                      key={label}
                      style={{ cursor: "pointer" }}
                    >
                      <StyledTableCell align="center" isThin colSpan={colSpan}>
                        {label}
                      </StyledTableCell>
                    </Tooltip>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(output2?.[input] || {}).map((rowKey, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <Tooltip
                      style={{ cursor: "pointer" }}
                      title={(() => {
                        if (rowKey === "sum V") {
                          return "OR function of vectors that relate to the observed primary output";
                        }

                        if (rowKey === "good") {
                          return "Good values simulation";
                        }

                        if (rowKey === "fault") {
                          return "Fault detection vector";
                        }
                      })()}
                    >
                      <StyledTableCell align="center">{rowKey}</StyledTableCell>
                    </Tooltip>
                    {Object.keys(output2[input][rowKey]).map(
                      (cellKey, cellIndex) => {
                        const value = output2[input][rowKey][cellKey];
                        const cell = value === 0 && Number(rowKey) ? "" : value;

                        return (
                          <BinaryCell
                            key={`${cellIndex}${cell}`}
                            value={cell}
                          />
                        );
                      }
                    )}
                    {dVec?.[input]?.[rowKey]?.inputs?.map((cell: number) => {
                      return (
                        <GradientCell align="center" key={cell} value={cell}>
                          <Typography variant="body1">{cell}</Typography>
                        </GradientCell>
                      );
                    })}

                    {dVec?.[input]?.[rowKey]?.i_set && (
                      <BinaryCell
                        key={dVec?.[input]?.[rowKey]?.i_set?.join("")}
                        value={dVec?.[input]?.[rowKey]?.i_set?.join("")}
                      />
                    )}

                    {dVec?.[input]?.[rowKey]?.d_vec && (
                      <BinaryCell
                        key={dVec?.[input]?.[rowKey]?.d_vec?.join("")}
                        value={dVec?.[input]?.[rowKey]?.d_vec?.join("")}
                      />
                    )}

                    {dVec?.[input]?.[rowKey]?.vector && (
                      <TableCell
                        align="center"
                        key={dVec?.[input]?.[rowKey]?.vector}
                      >
                        <Typography variant="body1">
                          {dVec?.[input]?.[rowKey]?.vector}
                        </Typography>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabPanel>
        ))}
      </Output>
    </Wrapper>
  );
};
