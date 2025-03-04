import { Box, Panel } from "./TabPanel.styled";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const TabPanel = ({
  children,
  value,
  index,
  ...other
}: TabPanelProps) => {
  return (
    <Panel
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Panel>
  );
};
