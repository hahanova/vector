import { Panel } from "./MainTabPanel.styled";

interface MainTabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  hasSpace?: boolean;
  hasScroll?: boolean;
}

export const MainTabPanel = ({
  children,
  value,
  index,
  hasSpace,
  hasScroll = false,
  ...other
}: MainTabPanelProps) => {
  return (
    <Panel
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </Panel>
  );
};
