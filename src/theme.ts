import { createTheme } from "@mui/material";

declare module "@mui/material" {
  interface TypeBackground {
    zeroCell: string;
    field: string;
    styledCell: string;
    highlightCell: string;
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
      styledCell: '#58516b',
      highlightCell: "#17161c",
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
