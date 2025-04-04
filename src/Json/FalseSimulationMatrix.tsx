import { TableHead, TableRow, TableBody } from "@mui/material";

import { BinaryCell, TableCell } from "../components";
import { StyledTableCell, Table } from "../Vector/Vector.styled";

export interface FalseSimulationMatrix {
  [key: string]: {
    fault: { [key: string]: Array<number | string> };
    modeling: { [key: string]: Array<number | string> };
  };
}

export const FalseSimulationMatrix = ({
  falseSimulationMatrix,
}: FalseSimulationMatrix) => {
  if (!falseSimulationMatrix || Object.keys(falseSimulationMatrix).length === 0)
    return;

  const keys = Object.keys(falseSimulationMatrix) || {};
  const faultKeys = Object.keys(falseSimulationMatrix?.[keys?.[0]]?.fault);
  const modelingKeys = Object.keys(
    falseSimulationMatrix?.[keys?.[0]]?.modeling
  );

  return (
    <Table sx={{ mt: 4 }}>
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          {faultKeys.map((key) => (
            <StyledTableCell key={`fault${key}`}>F{key}</StyledTableCell>
          ))}
          {modelingKeys.map((key) => (
            <StyledTableCell key={`modeling${key}`}>M{key}</StyledTableCell>
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
  );
};
