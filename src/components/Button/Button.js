import { ThemeProvider } from "styled-components";
import { ButtonContainer } from "./ButtonStyles";
import { theme } from "../../theme";
import { useEffect } from "react";
import { useState } from "react";

//INSTRUCTIONS FOR USE
// 3 props:
//1. filledColor (String) - The color when the button is filled, text will be white by default
//2. defaultColor (String) - The color when the button is not filled, will colour the border and the text tgt. You cannot have different coloured text and border for this.
//3. filled (String) - "filled" / "not filled" When set to "filled", the button will be by default filled and when hovered it will changed to not filled, and vice versa.
//4. onClick - You need to create a function in the parent element (the level above this)
//5. (Optional) buttonType: "toggle" for a button when you click it stays filled when you click again it unfills. Do not add this if you want a normal button.

//See AdminExamDetailsPage line 97 onwards for example

const Button = (props) => {
  //handle if no inputs
  const filled = props.filled;
  const defaultColor = props.defaultColor ? props.defaultColor : theme.text;
  const filledColor = props.filledColor ? props.filledColor : theme.text;

  const [toggleButtonState, setToggleButtonState] = useState(
    filled ? filled : false
  );
  const buttonType = props.buttonType ? props.buttonType : "";
  const { onClick = () => {} } = props;
  const getButtonType = () => {
    switch (buttonType) {
      case "toggle":
        return (
          <ButtonContainer
            filledColor={filledColor}
            defaultColor={defaultColor}
            filled={toggleButtonState}
            onClick={() => {
              setToggleButtonState(!toggleButtonState);
              props.onClick();
            }}
          >
            {props.children}
          </ButtonContainer>
        );
      default:
        return (
          <ButtonContainer
            filledColor={filledColor}
            defaultColor={defaultColor}
            filled={filled}
            onClick={props.onClick}
          >
            {props.children}
          </ButtonContainer>
        );
    }
  };

  return <ThemeProvider theme={theme}>{getButtonType()}</ThemeProvider>;
};

export default Button;
