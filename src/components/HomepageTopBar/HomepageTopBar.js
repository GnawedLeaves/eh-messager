import { ThemeProvider } from "styled-components";
import {
  HomePageTopBarContainer,
  HomePageTopBarHamburgerAndTitle,
} from "./HomepageTopBarStyles";
import { darktheme, lightTheme } from "../../theme";
import { RxHamburgerMenu } from "react-icons/rx";
import { useState } from "react";
import { useEffect } from "react";
import SearchBar from "../SearchBar/SearchBar";

const HomepageTopBar = (props) => {
  return (
    <ThemeProvider theme={props.themeMode === "light" ? lightTheme : darktheme}>
      <HomePageTopBarContainer>
        <HomePageTopBarHamburgerAndTitle>
          <RxHamburgerMenu
            style={{ cursor: "pointer" }}
            onClick={() => {
              props.handleOpenSidebar();
            }}
          />
          Chats
        </HomePageTopBarHamburgerAndTitle>

        <SearchBar allUsers={props.allUsers} themeMode={props.themeMode} />
      </HomePageTopBarContainer>
    </ThemeProvider>
  );
};

export default HomepageTopBar;
