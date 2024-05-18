import { ThemeProvider } from "styled-components";
import {
  SideBarContainer,
  SidebarBigContainer,
  SidebarBlocker,
  SidebarOption,
  SidebarOptionsContainer,
  SidebarProfileBox,
  SidebarProfilePicture,
  SidebarThemeModeContainer,
  SidebarUsername,
} from "./SidebarStyles";
import { darktheme, lightTheme } from "../../theme";
import { IoPersonCircleSharp } from "react-icons/io5";
import { IoPersonCircleOutline } from "react-icons/io5";

import { IoColorPaletteSharp } from "react-icons/io5";
import { IoColorPaletteOutline } from "react-icons/io5";

import { IoSunnyOutline } from "react-icons/io5";
import { IoMoon } from "react-icons/io5";

const Sidebar = (props) => {
  const lightSidebarOptions = [
    { title: "Profile", icon: <IoPersonCircleSharp size={"24px"} /> },
    { title: "Theme", icon: <IoColorPaletteSharp size={"24px"} /> },
  ];

  const darkSidebarOptions = [
    { title: "Profile", icon: <IoPersonCircleOutline size={"24px"} /> },
    { title: "Theme", icon: <IoColorPaletteOutline size={"24px"} /> },
  ];

  return (
    <ThemeProvider theme={props.themeMode === "light" ? lightTheme : darktheme}>
      {props.showSidebar ? (
        <SidebarBigContainer>
          <SideBarContainer>
            <SidebarProfileBox>
              <SidebarProfilePicture src={props.profilePicture} />
              <SidebarUsername>{props.username}</SidebarUsername>
              <SidebarThemeModeContainer>
                {props.themeMode === "light" ? (
                  <IoMoon
                    size={"24px"}
                    color={lightTheme.white}
                    onClick={() => {
                      props.handleThemeModeChange("dark");
                    }}
                  />
                ) : (
                  <IoSunnyOutline
                    size={"24px"}
                    color={darktheme.white}
                    onClick={() => {
                      props.handleThemeModeChange("light");
                    }}
                  />
                )}
              </SidebarThemeModeContainer>
            </SidebarProfileBox>
            <SidebarOptionsContainer>
              {props.themeMode === "light"
                ? lightSidebarOptions.map((option, index) => {
                    return (
                      <SidebarOption key={index}>
                        {option.icon}
                        {option.title}
                      </SidebarOption>
                    );
                  })
                : darkSidebarOptions.map((option, index) => {
                    return (
                      <SidebarOption key={index}>
                        {option.icon}
                        {option.title}
                      </SidebarOption>
                    );
                  })}
            </SidebarOptionsContainer>
          </SideBarContainer>
          <SidebarBlocker
            onClick={() => {
              console.log("Clicked");
              props.handleCloseSidebar(false);
            }}
          />
        </SidebarBigContainer>
      ) : (
        <></>
      )}
    </ThemeProvider>
  );
};

export default Sidebar;
