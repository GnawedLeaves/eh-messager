import { useContext } from "react";
import { UserContext } from "./App";
import { useEffect } from "react";

export const LightTheme = () => {
  //the optimal way is just to edit this file dynamically, by calling the function to get the theme then just changing the colours but there seems to be errors like no mother father can fathom when i use usecontext in this file i dont understand why i think i have to manually edit everything and put the theme into the user context and just pull from there alr then i just pull from user context each time that theme provider is used bah no choice alr
  // const user = useContext(UserContext);
  const themeNumber = 1;

  if (themeNumber === 1) {
    return {
      text: "#333333",
      background: "#F7F3E6",
      innerBackground: "#FEFBF1",
      grey: "#747886",
      lightGrey: "#C0C0C0",
      white: "#FEFBF1",
      borderGrey: "#D1D1D1",
      boxShadow: "2px 2px 5px #B6B6B6, -5px -5px 10px #ffffff",
      error: "#FF565D",
      font: "Poppins, sans-serif",
      recievedTextBackground: "#ff787f",
      primary: "#F8865C",
    };
  } else {
    return {
      primary: "#F8865C",
      text: "#333333",
      background: "#F7F3E6",
      innerBackground: "#FEFBF1",
      grey: "#747886",
      lightGrey: "#C0C0C0",
      white: "#FEFBF1",
      borderGrey: "#D1D1D1",
      boxShadow: "2px 2px 5px #B6B6B6, -5px -5px 10px #ffffff",
      error: "#FF565D",
      font: "Poppins, sans-serif",
    };
  }
};

export const lightTheme2 = {
  primary: "#F8865C",

  text: "#333333",
  background: "#F7F3E6",
  innerBackground: "#FEFBF1",
  grey: "#747886",
  lightGrey: "#C0C0C0",
  white: "#FEFBF1",
  borderGrey: "#D1D1D1",
  boxShadow: "2px 2px 5px #B6B6B6, -5px -5px 10px #ffffff",
  error: "#FF565D",
  font: "Poppins, sans-serif",
};

export const darktheme = {

  text: "#FEFBF1",
  background: "#1B1B1B",
  innerBackground: "#292929",
  grey: "#747886",
  lightGrey: "#C0C0C0",
  white: "#FEFBF1",
  borderGrey: "#464646",
  boxShadow: "",
  error: "#FF565D",
  font: "Poppins, sans-serif",

  
  primary: "#F8865C",
};

export const theme = {
  primary: "#009ADF",
  background: "#FBFBFB",
  text: "#333333",
  secondaryLight: "#EEFDFF",
  font: "Poppins, sans-serif",
  transition: "0.2s",
  statusGood: "#36D59D",
  statusError: "#FF8080",
  statusIntermediate: "#FFCF96",
  grey: "#E9E9E9",
  white: "#ffffff",
  boxShadow: "box-shadow: 2px 2px 5px #e8e8e8, -5px -5px 10px #ffffff;",
};

export const darktheme2 = {
  primary: "#009ADF",
  background: "#333333",
  text: "#FBFBFB",
  secondaryLight: "#EEFDFF",
  font: "Poppins, sans-serif",
  transition: "0.2s",
  statusGood: "#00CF86",
  statusError: "#FF8080",
  statusIntermediate: "#FFCF96",
  grey: "#D3D3D3",
};
