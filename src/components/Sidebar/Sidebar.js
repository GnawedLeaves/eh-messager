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
import { useState } from "react";
import { useEffect } from "react";

const Sidebar = (props) => {
  const navigate = useNavigate();
  const [profileNavigationString, setProfileNavigationString] = useState("");
  useEffect(() => {
    setProfileNavigationString("/profile/" + props.userId);
  }, [props.userId]);

  const lightSidebarOptions = [
    {
      title: "Profile",
      icon: <IoPersonCircleSharp size={"24px"} />,
      navigateTo: profileNavigationString,
    },
    {
      title: "Theme",
      icon: <IoColorPaletteSharp size={"24px"} />,
      navigateTo: "/theme",
    },
  ];

  const darkSidebarOptions = [
    {
      title: "Profile",
      icon: <IoPersonCircleOutline size={"24px"} />,
      navigateTo: profileNavigationString,
    },
    {
      title: "Theme",
      icon: <IoColorPaletteOutline size={"24px"} />,
      navigateTo: "/theme",
    },
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
      <SidebarBigContainer showSidebar={props.showSidebar ? "0%" : "-150%"}>
        <SideBarContainer>
          <SidebarProfileBox>
            <SidebarProfilePicture
              src={props.profilePicture}
              onClick={() => {
                navigate(profileNavigationString);
              }}
            />
            <SidebarUsername>{props.username}</SidebarUsername>
            <SidebarThemeModeContainer>
              {props.themeMode === "light" ? (
                <IoMoon
                  style={{ cursor: "pointer" }}
                  size={"24px"}
                  color={lightTheme.white}
                  onClick={() => {
                    props.handleThemeModeChange("dark");
                  }}
                />
              ) : (
                <IoSunnyOutline
                  style={{ cursor: "pointer" }}
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
                    <SidebarOption
                      key={index}
                      onClick={() => {
                        if (option.navigateTo) {
                          navigate(option.navigateTo);
                        }
                      }}
                    >
                      {option.icon}
                      {option.title}
                    </SidebarOption>
                  );
                })
              : darkSidebarOptions.map((option, index) => {
                  return (
                    <SidebarOption
                      key={index}
                      onClick={() => {
                        if (option.navigateTo) {
                          navigate(option.navigateTo);
                        }
                      }}
                    >
                      {option.icon}
                      {option.title}
                    </SidebarOption>
                  );
                })}
          </SidebarOptionsContainer>
        </SideBarContainer>
        <SidebarBlocker
          showSidebar={props.showSidebar ? "100%" : "0"}
          onClick={() => {
            props.handleCloseSidebar(false);
          }}
        />
      </SidebarBigContainer>
    </ThemeProvider>
  );
};

export default Sidebar;
