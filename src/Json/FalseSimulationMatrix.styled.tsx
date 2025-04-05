import { Box as MuiBox } from "@mui/material";
import { css } from "@mui/material/styles";
import styled from "@emotion/styled";

import { TableCell } from "../components";

export const GapCell = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== "hasNoBorder",
})<{ hasNoBorder?: boolean }>(
  ({ hasNoBorder }) => css`
    border-bottom: 0;
    ${hasNoBorder && "border-right: 0;"}
  `
);

export const Box = styled(MuiBox)(
  ({ theme }) => css`
    overflow-x: auto;
    width: 100%;
    display: flex;
    justify-content: center;

    table tr:hover td {
      background-color: ${theme.palette.background.highlightCell}80;
    }
  `
);
