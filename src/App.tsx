import "./App.css";
import { Main } from "./App.styled";
import { Vector } from "./Vector";
import { Box, Tab, Tabs, ThemeProvider } from "@mui/material";
import { useState } from "react";
import { TabPanel } from "./components";
import { Json } from "./Json";
import { MainTabPanel } from "./components/MainTabPanel";
import { theme } from "./theme";

function App() {
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Main>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            centered
          >
            <Tab label="Vector" />
            {/* <Tab label="JSON" /> */}
          </Tabs>
        </Box>
        <MainTabPanel value={value} index={0}>
          <Vector />
        </MainTabPanel>
        <TabPanel value={value} index={1}>
          <Json />
        </TabPanel>
      </Main>
    </ThemeProvider>
  );
}

export default App;
