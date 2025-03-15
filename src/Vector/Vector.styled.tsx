import MuiTextField from "@mui/material/TextField";
import MuiTableCell, { TableCellProps } from "@mui/material/TableCell";
import styled from "@emotion/styled";
import { css, Theme } from "@mui/material/styles";
import MuiTable from "@mui/material/Table";

import { getContrastRatio, interpolateColor } from "./utils";

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
`;

export const TableCell = styled(MuiTableCell)`
  font-size: 1rem;
  padding: 4px 8px;
  border-right: 1px solid rgba(81, 81, 81, 1);
`;

export const StyledTableCell = styled(TableCell)<{ isThin?: boolean }>(
  ({ isThin }) => css`
    background-color: #58516b;
    font-weight: 500;
    padding: 4px ${isThin ? 11 : 8}px;
  `
);

export const ZeroTableCell = styled(TableCell)(
  ({ theme }) => css`
    background-color: ${theme.palette.background.zeroCell};
  `
);

export const Table = styled(MuiTable)`
  width: unset;
`;

interface CustomTableCellProps extends TableCellProps {
  value: number;
}

export const CustomTableCell = styled(TableCell)<CustomTableCellProps>(({
  value,
}) => {
  const backgroundColor = interpolateColor(value);
  const matchResult = backgroundColor.match(/\d+/g);
  const [r, g, b] = matchResult ? matchResult.map(Number) : [0, 0, 0];
  const contrast = getContrastRatio({ r, g, b }, { r: 255, g: 255, b: 255 }); // Contrast with white text

  return {
    backgroundColor,
    color: contrast < 4.5 ? "black" : "white", // Use black text if contrast is too low
  };
});
