import styled from "styled-components";

export const LoginFieldContainer = styled.div`
  cursor: text;
`;

export const LoginFieldInput = styled.input`
  width: 250px;
  height: 45px;
  border: none;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.borderGrey};
  padding: 0px 10px;
  font-size: 12px;
`;

export const LoginFieldLabel = styled.div`
  font-size: 12px;
  margin-bottom: 4px;
`;
