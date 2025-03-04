import "./App.css";
import { Main, Textarea } from "./App.styled";
import { Vector } from "./Vector";
import { Box, Tab, Tabs, ThemeProvider, createTheme } from "@mui/material";
import { useState } from "react";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#b49cf5",
    },
  },
});

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
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function App() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Main>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            centered
          >
            <Tab label="Vector" />
            <Tab label="JSON" />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Vector />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Textarea
            value={`{
  "5": {
    "vector": "1000",
    "inputs": ["r3", "r1"]
  },
  "6": {
    "vector": "1000",
    "inputs": ["r2", "r3"]
  },
  "7": {
    "vector": "1000",
    "inputs": ["r2", "r4"]
  },
  "8": {
    "vector": "1000",
    "inputs": ["r2", "5"]
  },
  "9": {
    "vector": "1000",
    "inputs": ["r1", "6"]
  },
  "10": {
    "vector": "1000",
    "inputs": ["6", "r4"]
  },
  "11": {
    "vector": "1000",
    "inputs": ["7", "r3"]
  },
  "12": {
    "vector": "1000000000000000",
    "inputs": ["8", "9", "10", "11"],
    "is_output": true
  }
}`}
          />
        </CustomTabPanel>
      </Main>
    </ThemeProvider>
  );
}

export default App;
