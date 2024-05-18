import { ThemeProvider } from "styled-components";
import { HomePageTopBarContainer } from "./HomepageTopBarStyles";
import { lightTheme } from "../../theme";
import { RxHamburgerMenu } from "react-icons/rx";
import { useState } from "react";
import { useEffect } from "react";

const HomepageTopBar = (props) => {
  const [openSideBar, setOpenSideBar] = useState(false);

  return (
    <ThemeProvider theme={lightTheme}>
      <HomePageTopBarContainer>
        <RxHamburgerMenu
          onClick={() => {
            props.handleOpenSidebar(!openSideBar);
            setOpenSideBar(!openSideBar);
          }}
        />
        Chats
      </HomePageTopBarContainer>
    </ThemeProvider>
  );
};

export default HomepageTopBar;
