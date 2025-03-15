import { useLayoutEffect, useState } from "react";
import { Box, Button, FormLabel, Tab, Tabs } from "@mui/material";

import {
  ButtonWrapper,
  ErrorMessage,
  LabelWrapper,
  Textarea,
  Wrapper,
} from "./Json.styled";
import { getTruthTable } from "../Vector/utils";

import { Output } from "../Vector/Vector.styled";
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

  const handleGenerate = () => {
    const parsedJson = validateAndParseJson(value);

    if (!parsedJson) return;

    const formattedJson = JSON.stringify(parsedJson, null, 2);

    setValue(formattedJson);

    try {
      const scheme = Scheme.fromDict(parsedJson);
      const inputs_obj = getTruthTable(scheme.inputs.length);

      const output1 = inputs_obj.map((input_, input_i) => {
        const input_name = `${input_i}_${input_}`;
        const simulation_matrix = scheme.simulationMatrixForInput(input_);

        return {
          input_name,
          simulation_matrix,
        };
      });

      setTruthTable(inputs_obj);

      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

      console.log("Output:", {
        parsedJson,
        scheme,
        inputs_obj,
        output1,
      });
    } catch (error) {
      setError("This JSON cannot be processed, try with another one");
      console.error((error as Error).message);
    }
  };

  return (
    <Wrapper>
      <LabelWrapper>
        <FormLabel htmlFor="configuration">
          Enter scheme configuration:
        </FormLabel>
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
        aria-label="Enter scheme configuration"
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
            <Box style={{ margin: "2em", marginBottom: "10em" }}>{input}</Box>
          </TabPanel>
        ))}
      </Output>
    </Wrapper>
  );
};
