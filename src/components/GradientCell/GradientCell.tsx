import { TableCellProps } from "@mui/material/TableCell";
import styled from "@emotion/styled";

import { TableCell } from "../TableCell";
import { getContrastRatio, interpolateColor } from "./utils";

interface GradientCellProps extends TableCellProps {
  value: number;
}

export const GradientCell = styled(TableCell)<GradientCellProps>(({
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
