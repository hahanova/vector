import { useLayoutEffect, useState } from "react";
import {
  Box,
  Button,
  FormLabel,
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
  ErrorMessage,
  LabelWrapper,
  Textarea,
  Wrapper,
} from "./Json.styled";
import { getTruthTable } from "../Vector/utils";

import {
  Output,
  StyledTableCell,
  ZeroTableCell,
} from "../Vector/Vector.styled";
import { TabPanel } from "../components";
import CONFIGURATION_EXAMPLE from "./configuration-example.json";
import { Scheme } from "./utils";

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

  const handleGenerate = () => {
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

        return acc;
      }, {});

      setTruthTable(inputs_obj);

      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

      // console.log("Output:", {
      //   parsedJson,
      //   scheme,
      //   inputs_obj,
      //   output1,
      //   output2,
      //   dVec,
      // });

      setOutput2(output2);
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
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(output2?.[input] || {}).map((rowKey, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <StyledTableCell align="center">{rowKey}</StyledTableCell>
                    {Object.keys(output2[input][rowKey]).map(
                      (cellKey, cellIndex) => {
                        const cell = output2[input][rowKey][cellKey];
                        return cell === 1 ? (
                          <TableCell align="center" key={cellIndex}>
                            <Typography variant="body1">{cell}</Typography>
                          </TableCell>
                        ) : (
                          <ZeroTableCell align="center" key={cellIndex}>
                            <Typography variant="body1">{cell}</Typography>
                          </ZeroTableCell>
                        );
                      }
                    )}
                    {dVec?.[input]?.[rowKey]?.d_vec &&
                      dVec?.[input]?.[rowKey]?.d_vec.map(
                        (cellKey, cellIndex) => {
                          return cellKey === 1 ? (
                            <TableCell align="center" key={cellIndex}>
                              <Typography
                                variant="body1"
                                style={{ color: "yellow" }}
                              >
                                {cellKey}
                              </Typography>
                            </TableCell>
                          ) : (
                            <ZeroTableCell align="center" key={cellIndex}>
                              <Typography
                                variant="body1"
                                style={{ color: "yellow" }}
                              >
                                {cellKey}
                              </Typography>
                            </ZeroTableCell>
                          );
                        }
                      )}
                    {dVec?.[input]?.[rowKey]?.inputs &&
                      dVec?.[input]?.[rowKey]?.inputs.map(
                        (cellKey, cellIndex) => {
                          return cellKey === 1 ? (
                            <TableCell align="center" key={cellIndex}>
                              <Typography
                                variant="body1"
                                style={{ color: "red" }}
                              >
                                {cellKey}
                              </Typography>
                            </TableCell>
                          ) : (
                            <ZeroTableCell align="center" key={cellIndex}>
                              <Typography
                                variant="body1"
                                style={{ color: "red" }}
                              >
                                {cellKey}
                              </Typography>
                            </ZeroTableCell>
                          );
                        }
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
