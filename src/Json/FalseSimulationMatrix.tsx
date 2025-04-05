import {
  TableHead,
  TableRow,
  TableBody,
  useTheme,
  Typography,
} from "@mui/material";

import { BinaryCell } from "../components";
import { StyledTableCell, Table } from "../Vector/Vector.styled";
import { Box, GapCell } from "./FalseSimulationMatrix.styled";

export interface FalseSimulationMatrix {
  [key: string]: {
    fault: { [key: string]: Array<number | string> };
    modeling: { [key: string]: Array<number | string> };
  };
}

export const FalseSimulationMatrix = ({
  falseSimulationMatrix,
}: FalseSimulationMatrix) => {
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
      <Typography variant="h3" component="h1" align="center" sx={{ mt: 7, mb: 6 }}>
        Circuit Vector Fault Simulation
      </Typography>
      <Box>
        <Table>
          <TableHead>
            <TableRow>
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
            {keys.map((key) => (
              <TableRow key={key}>
                <StyledTableCell align="center">{key}</StyledTableCell>
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
