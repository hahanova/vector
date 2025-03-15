import { createTheme } from "@mui/material";

declare module "@mui/material" {
  interface TypeBackground {
    zeroCell: string;
    field: string;
  }

  interface Color {
    750: string;
  }
}

export const theme = createTheme({
  palette: {
    background: {
      zeroCell: "#333333",
      field: "#242424",
    },
    mode: "dark",
    primary: {
      main: "#b49cf5",
    },
    grey: {
      750: "#575757",
    },
  },
});
