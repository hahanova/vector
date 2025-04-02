import { css } from "@mui/material/styles";
import styled from "@emotion/styled";
import { TableCell } from "../TableCell";

export const ZeroTableCell = styled(TableCell)(
  ({ theme }) => css`
    background-color: ${theme.palette.background.zeroCell};
  `
);
