import { useContext } from "react";
import { UserContext } from "./App";

export const lightTheme = () => {
  //the optimal way is just to edit this file dynamically, by calling the function to get the theme then just changing the colours

  const themeNumber = 1;

  if (themeNumber === 1) {
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
      recievedTextBackground: "#ff787f",
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
  primary: "#F8865C",
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
