import { ThemeProvider } from "styled-components";
import { HomePageTopBarContainer } from "./HomepageTopBarStyles";
import { darktheme, lightTheme } from "../../theme";
import { RxHamburgerMenu } from "react-icons/rx";
import { useState } from "react";
import { useEffect } from "react";

const HomepageTopBar = (props) => {
  return (
    <ThemeProvider theme={props.themeMode === "light" ? lightTheme : darktheme}>
      <HomePageTopBarContainer>
        <RxHamburgerMenu
          onClick={() => {
            props.handleOpenSidebar();
          }}
        />
        Chats
      </HomePageTopBarContainer>
    </ThemeProvider>
  );
};

export default HomepageTopBar;
