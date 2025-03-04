import { createTheme } from "@mui/material";

declare module "@mui/material" {
  interface TypeBackground {
    zeroCell: string;
  }
}

export const theme = createTheme({
  palette: {
    background: {
      zeroCell: "#333333",
    },
    mode: "dark",
    primary: {
      main: "#b49cf5",
    },
  },
});
