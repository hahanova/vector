import { useLayoutEffect, useRef, useState } from "react";
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
  useTheme,
} from "@mui/material";

import {
  ButtonWrapper,
  ErrorMessage,
  LabelWrapper,
  Textarea,
  Wrapper,
} from "./Json.styled";

import { Output, StyledTableCell } from "../Vector/Vector.styled";
import { BinaryCell, GradientCell, TabPanel, TableCell } from "../components";
import CONFIGURATION_EXAMPLE from "./configuration-example.json";
import { FalseSimulationMatrix } from "./FalseSimulationMatrix";
import { GapCell } from "./FalseSimulationMatrix.styled";
import { getValues } from "./calculateMainTable";

const customColumnNames = [
  { label: "Input", colSpan: 2 },
  { label: "I-set", tooltip: "Input Set" },
  { label: "LV", tooltip: "Logic Vector" },
  { label: "DV", tooltip: "Deductive Vector" },
];

export const Json = () => {
  const theme = useTheme();
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

  const typographyRef = useRef(null);

  useLayoutEffect(() => {
    if (truthTable && typographyRef.current) {
      typographyRef.current.scrollIntoView({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [truthTable]);

  useLayoutEffect(() => {
    if (shouldScrollToTop) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      setShouldScrollToTop(false);
    }
  }, [shouldScrollToTop]);

  const [output2, setOutput2] = useState<any>([]);
  const [dVec, setDVec] = useState<any>({});
  const [falseSimulationMatrix, setFalseSimulationMatrix] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [superIntegral, setSuperIntegral] = useState<any>({});
  const [q, setQ] = useState<any>({});

  const handleGenerate = async () => {
    setIsLoading(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

    await new Promise((resolve) => setTimeout(resolve, 0));

    const parsedJson = validateAndParseJson(value);

    if (!parsedJson) return;

    const formattedJson = JSON.stringify(parsedJson, null, 2);

    setValue(formattedJson);

    try {
      const {
        output2,
        falseSimulationMatrix,
        dVec,
        q,
        superIntegral,
        inputs_obj,
      } = await getValues(parsedJson);

      setFalseSimulationMatrix(falseSimulationMatrix);
      setQ(q);
      setDVec(dVec);
      setSuperIntegral(superIntegral);
      setTruthTable(inputs_obj);
      setOutput2(output2);
    } catch (error) {
      setError("This JSON cannot be processed, try with another one");
      console.error(error);
    } finally {
      setIsLoading(false);
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
        <Box style={{ textAlign: "center" }} sx={{ mt: 4 }}>
          <CircularProgress />
          <Typography sx={{ mt: 4 }}>
            We are creating a vector fault simulation...
          </Typography>
        </Box>
      )}
      <FalseSimulationMatrix
        ref={typographyRef}
        falseSimulationMatrix={falseSimulationMatrix}
        truthTable={truthTable}
        q={q}
        superIntegral={superIntegral}
      />
      <Output>
        {Object.keys(output2).length > 0 && (
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{ mb: 4, mt: 4 }}
          >
            Fault Simulation on Test Set
          </Typography>
        )}
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
                  <GapCell></GapCell>
                  <StyledTableCell
                    colSpan={12}
                    align="center"
                    style={{
                      background: `${theme.palette.background.styledCell}80`,
                    }}
                  >
                    Fault Simulation Matrix
                  </StyledTableCell>
                  <GapCell></GapCell>
                  <StyledTableCell
                    colSpan={12}
                    align="center"
                    style={{
                      background: `${theme.palette.background.styledCell}80`,
                    }}
                  >
                    Modeling Deductive Vectors
                  </StyledTableCell>
                </TableRow>
                <TableRow>
                  <GapCell></GapCell>
                  {Object.keys(output2?.[input]?.["1"] || {}).map(
                    (char, index) => (
                      <StyledTableCell align="center" key={index} isThin>
                        {char}
                      </StyledTableCell>
                    )
                  )}
                  <GapCell></GapCell>
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
                    <GapCell
                      hasNoBorder={!dVec?.[input]?.[rowKey]?.inputs}
                    ></GapCell>
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

                    {dVec?.[input]?.[rowKey]?.d_vec && (
                      <BinaryCell
                        key={dVec?.[input]?.[rowKey]?.d_vec?.join("")}
                        value={dVec?.[input]?.[rowKey]?.d_vec?.join("")}
                      />
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
