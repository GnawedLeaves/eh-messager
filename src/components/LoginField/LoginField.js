import { ThemeProvider } from "styled-components";
import { darktheme, lightTheme } from "../../theme";
import {
  LoginFieldContainer,
  LoginFieldInput,
  LoginFieldLabel,
} from "./LoginFieldStyles";

const LoginField = (props) => {
  return (
    <ThemeProvider theme={props.theme === "light" ? lightTheme : darktheme}>
      <LoginFieldContainer>
        <LoginFieldLabel>{props.placeholder}</LoginFieldLabel>
        <LoginFieldInput
          type={props.type === "password" ? "password" : ""}
          onChange={props.inputOnChange}
          placeholder={props.placeholder}
        />
      </LoginFieldContainer>
    </ThemeProvider>
  );
};

export default LoginField;
