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
import { darktheme, LightTheme } from "../../theme";
import { IoPersonCircleSharp } from "react-icons/io5";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoHomeSharp } from "react-icons/io5";
import { IoColorPaletteSharp } from "react-icons/io5";
import { IoColorPaletteOutline } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { IoSunnyOutline } from "react-icons/io5";
import { IoMoon } from "react-icons/io5";
import { signOut } from "firebase/auth";
import { auth } from "../../database/firebase";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { UserContext } from "../../App";
import { getBestTextColor } from "../../functions/getBestTextColor";
import defaultProfilePicture from "../../assets/profile-pic.png";

const Sidebar = (props) => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const [profileNavigationString, setProfileNavigationString] = useState("");

  const [siderBarTextColor, setSideBarTextColor] = useState("");
  useEffect(() => {
    setProfileNavigationString("/profile/" + props.userId);
  }, [props.userId]);

  const lightSidebarOptions = [
    {
      title: "Home",
      icon: <IoHomeSharp size={"24px"} />,
      navigateTo: "/home",
    },
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
      title: "Home",
      icon: <IoHomeOutline size={"24px"} />,
      navigateTo: "/home",
    },
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

  useEffect(() => {
    if (user !== null) {
      setSideBarTextColor(
        getBestTextColor(user?.selectedThemeData?.selectedThemeLight.primary)
      );
    } else {
      setSideBarTextColor(getBestTextColor(LightTheme.primary));
    }
  }, [user]);

  return (
    <ThemeProvider
      theme={
        user?.themeMode === "light"
          ? user?.selectedThemeData?.selectedThemeLight || LightTheme
          : user?.selectedThemeData?.selectedThemeDark || darktheme
      }
    >
      <SidebarBigContainer showSidebar={props.showSidebar ? "0%" : "-150%"}>
        <SideBarContainer>
          <SidebarProfileBox>
            <SidebarProfilePicture
              src={
                props.profilePicture
                  ? props.profilePicture
                  : defaultProfilePicture
              }
              onClick={() => {
                navigate(profileNavigationString);
              }}
            />
            <SidebarUsername color={siderBarTextColor}>
              {props.username}
            </SidebarUsername>
            <SidebarThemeModeContainer>
              {props.themeMode === "light" ? (
                <IoMoon
                  style={{ cursor: "pointer" }}
                  size={"24px"}
                  color={siderBarTextColor}
                  onClick={() => {
                    props.handleThemeModeChange("dark");
                  }}
                />
              ) : (
                <IoSunnyOutline
                  style={{ cursor: "pointer" }}
                  size={"24px"}
                  color={siderBarTextColor}
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
