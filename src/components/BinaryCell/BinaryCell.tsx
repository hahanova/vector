import {  Typography } from "@mui/material";

import { TableCell } from "../TableCell";
import { ZeroTableCell } from "./BinaryCell.styled";

interface BinaryCellProps {
  value?: number;
}

export const BinaryCell = ({ value, ...rest }: BinaryCellProps) => {
  return value ? (
    <TableCell align="center" {...rest}>
      <Typography variant="body1">
        {value}
      </Typography>
    </TableCell>
  ) : (
    <ZeroTableCell align="center" {...rest}>
      <Typography variant="body1">
        {value}
      </Typography>
    </ZeroTableCell>
  );
};
