import "./App.css";
import { Main } from "./App.styled";
import { Vector } from "./Vector";
import { Box, Tab, Tabs, ThemeProvider } from "@mui/material";
import { useState } from "react";
import { Json } from "./Json";
import { MainTabPanel } from "./components/MainTabPanel";
import { theme } from "./theme";
import packageJson from "../package.json";

console.log(`Version: ${packageJson.version}`);

function App() {
  const localStorageTabValue = localStorage.getItem("selectedTab");

  const savedTab =
    localStorageTabValue !== null ? Number(localStorageTabValue) : 0;

  const [tabValue, setTabValue] = useState<number>(savedTab);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    localStorage.setItem("selectedTab", newValue.toString());
  };

  return (
    <ThemeProvider theme={theme}>
      <Main>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleChange} centered>
            <Tab label="Vector" />
            <Tab label="Circuit" />
          </Tabs>
        </Box>
        <MainTabPanel value={tabValue} index={0}>
          <Vector />
        </MainTabPanel>
        <MainTabPanel value={tabValue} index={1}>
          <Json />
        </MainTabPanel>
      </Main>
    </ThemeProvider>
  );
}

export default App;
