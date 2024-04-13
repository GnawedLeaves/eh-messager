import { ThemeProvider } from "styled-components";
import Chatbox from "../../components/Chatbox1/Chatbox";
import { HomePageContainer } from "./HomePageStyles";
import { theme } from "../../theme";

const HomePage = () => {
  return (
    <ThemeProvider theme={theme}>
      <HomePageContainer>
        <Chatbox userId="1" otherPersonId="2" />
      </HomePageContainer>
    </ThemeProvider>
  );
};

export default HomePage;
