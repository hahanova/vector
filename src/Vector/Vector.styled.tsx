import MuiTextField from "@mui/material/TextField";
import styled from "@emotion/styled";
import { css } from "@mui/material/styles";
import MuiTable from "@mui/material/Table";

import { TableCell } from "../components";

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TextField = styled(MuiTextField)`
  width: 100%;
  max-width: 400px;
  margin: 1em;
  margin-top: 2em;
`;

export const ButtonWrapper = styled.div`
  margin: 1em;
`;

export const Output = styled.div`
  width: 100%;
  margin-top: 4em;
  margin-bottom: 4em;
`;

export const StyledTableCell = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== "isThin",
})<{ isThin?: boolean }>(
  ({ isThin }) => css`
    background-color: #58516b;
    font-weight: 500;
    padding: 4px ${isThin ? 11 : 8}px;
  `
);

export const Table = styled(MuiTable)`
  width: unset;
`;

