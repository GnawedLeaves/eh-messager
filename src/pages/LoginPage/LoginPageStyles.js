import styled from "styled-components";

export const LoginPageContainer = styled.div`
  width: 100%;
  // background: red;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
  height: 100vh;
`;
export const LoginPageAppTitle = styled.div`
  font-size: 64px;
  font-weight: bold;
  margin-bottom: 12rem;
  text-align: center;
`;

export const LoginPageButton = styled.button`
  width: 250px;
  height: 45px;
  border: none;
  border-radius: 8px;
  // border: 1px solid ${(props) => props.theme.borderGrey};
  padding: 0px 10px;
  font-size: 14px;
  background: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.white};
  margin-top: 16px;
  box-shadow: ${(props) => props.theme.boxShadow};
  cursor: pointer;
`;

export const LoginPageSignUpText = styled.div`
  margin-top: 12px;
  color: ${(props) => props.theme.text};
  font-size: 14px;
`;
export const LoginPageSignUpSpan = styled.span`
  color: ${(props) => props.theme.primary};
  text-decoration: none;
  cursor: pointer;
`;

export const SignUpPageTitle = styled.div`
  font-size: 42px;
  font-weight: bold;
  margin-bottom: 10rem;
  text-align: center;
`;
