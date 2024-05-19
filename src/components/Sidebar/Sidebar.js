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
import { signOut } from "firebase/auth";
import { auth } from "../../database/firebase";
import { useNavigate } from "react-router-dom";

const Sidebar = (props) => {
  const navigate = useNavigate();
  const lightSidebarOptions = [
    { title: "Profile", icon: <IoPersonCircleSharp size={"24px"} /> },
    { title: "Theme", icon: <IoColorPaletteSharp size={"24px"} /> },
  ];

  const darkSidebarOptions = [
    { title: "Profile", icon: <IoPersonCircleOutline size={"24px"} /> },
    { title: "Theme", icon: <IoColorPaletteOutline size={"24px"} /> },
  ];

  const handleSignOut = async () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
        console.log("Sign out successful");
      })
      .catch((error) => {
        console.log("Error when signing out: ", error);
      });
  };
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
            <button
              onClick={() => {
                handleSignOut();
              }}
            >
              Sign Out
            </button>
          </SideBarContainer>
          <SidebarBlocker
            onClick={() => {
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
