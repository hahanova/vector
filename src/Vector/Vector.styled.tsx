import MuiTextField from "@mui/material/TextField";
import styled from "@emotion/styled";

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
  margin-top: 5em;
`;
