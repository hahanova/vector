import {
  TableHead,
  TableRow,
  TableBody,
  useTheme,
  Typography,
} from "@mui/material";

import { BinaryCell, TableCell } from "../components";
import { StyledTableCell, Table } from "../Vector/Vector.styled";
import { Box, GapCell } from "./FalseSimulationMatrix.styled";

export interface FalseSimulationMatrix {
  [key: string]: {
    fault: { [key: string]: Array<number | string> };
    modeling: { [key: string]: Array<number | string> };
  };
}

interface Props {
  falseSimulationMatrix: FalseSimulationMatrix;
  ref: React.RefObject<HTMLDivElement>;
  truthTable: Array<string>;
}

export const FalseSimulationMatrix = ({
  falseSimulationMatrix,
  ref,
  truthTable,
  q,
  superIntegral,
}: Props) => {
  const theme = useTheme();

  if (!falseSimulationMatrix || Object.keys(falseSimulationMatrix).length === 0)
    return;

  const keys = Object.keys(falseSimulationMatrix) || {};
  const faultKeys = Object.keys(falseSimulationMatrix?.[keys?.[0]]?.fault);
  const modelingKeys = Object.keys(
    falseSimulationMatrix?.[keys?.[0]]?.modeling
  );

  return (
    <>
      <div ref={ref}></div>
      <Typography
        variant="h3"
        component="h1"
        align="center"
        sx={{ mt: 7, mb: 6 }}
      >
        Circuit Vector Fault Simulation
      </Typography>
      <Box>
        <Table>
          <TableHead>
            <TableRow>
              <GapCell hasNoBorder></GapCell>
              <GapCell hasNoBorder></GapCell>
              <GapCell hasNoBorder></GapCell>
              <GapCell></GapCell>
              <StyledTableCell
                colSpan={12}
                align="center"
                style={{
                  background: `${theme.palette.background.styledCell}80`,
                }}
              >
                Fault Detected Table
              </StyledTableCell>
              <GapCell></GapCell>
              <StyledTableCell
                colSpan={12}
                align="center"
                style={{
                  background: `${theme.palette.background.styledCell}80`,
                }}
              >
                Good Value Simulation Table
              </StyledTableCell>
            </TableRow>
            <TableRow>
              <GapCell></GapCell>

              <StyledTableCell align="center">I</StyledTableCell>
              <StyledTableCell align="center">Q</StyledTableCell>

              <GapCell></GapCell>

              {faultKeys.map((key) => (
                <StyledTableCell key={`fault${key}`}>{key}</StyledTableCell>
              ))}
              <GapCell></GapCell>
              {modelingKeys.map((key) => (
                <StyledTableCell key={`modeling${key}`}>{key}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {truthTable?.map((key, index) => (
              <TableRow key={key}>
                <StyledTableCell align="center">{key}</StyledTableCell>

                <TableCell align="center">{superIntegral[index]}</TableCell>

                <TableCell align="center">{q[key]}</TableCell>

                <GapCell></GapCell>

                {faultKeys.map((faultKey) => (
                  <BinaryCell
                    value={falseSimulationMatrix[key].fault[faultKey]}
                    key={faultKey}
                  />
                ))}

                <GapCell></GapCell>

                {modelingKeys.map((modelingKey) => (
                  <BinaryCell
                    value={falseSimulationMatrix[key].modeling[modelingKey]}
                    key={modelingKey}
                  />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </>
  );
};
