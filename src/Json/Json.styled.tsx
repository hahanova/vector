import { TextareaAutosize } from "@mui/material";
import { css } from "@mui/material/styles";
import styled from "@emotion/styled";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2em;
`;

export const Textarea = styled(TextareaAutosize, {
  shouldForwardProp: (prop) => prop !== "hasError",
})<{ hasError?: boolean }>(
  ({ hasError, theme: { palette, shape } }) => css`
    margin-top: 2em;
    max-width: 800px;
    min-height: 600px;
    width: 100%;
    box-sizing: border-box;
    border-color: ${hasError ? palette.error.main : palette.grey[750]};
    background-color: ${palette.background.field};
    border-radius: ${shape.borderRadius}px;
    color: white;

    &:hover {
      border-color: ${hasError ? palette.error.main : palette.common.white};
    }

    &:focus {
      outline-color: ${hasError ? palette.error.main : palette.primary.main};
    }
  `
);

export const ButtonWrapper = styled.div`
  margin: 2em;
`;

export const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.palette.error.main};
  font-size: 12px;
  margin-top: 1em;
`;

export const LabelWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
`;
