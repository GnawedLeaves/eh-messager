import { ThemeProvider } from "styled-components";
import { lightTheme } from "../../theme";

const ThemePage = () => {
  return <ThemeProvider theme={lightTheme}>Theme Page</ThemeProvider>;
};

export default ThemePage;
