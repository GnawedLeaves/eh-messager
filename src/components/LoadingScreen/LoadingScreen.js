import { ThemeProvider } from "styled-components";
import { LoadingScreenContainer } from "./LoadingScreenStyles";
import { Oval } from "react-loader-spinner";
const LoadingScreen = (props) => {
  return (
    <ThemeProvider theme={props.theme}>
      <LoadingScreenContainer>
        Loading Chats
        <Oval
          visible={true}
          height="80"
          width="80"
          color={props.theme.primary}
          secondaryColor={props.theme.primary}
          ariaLabel="oval-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </LoadingScreenContainer>
    </ThemeProvider>
  );
};

export default LoadingScreen;
