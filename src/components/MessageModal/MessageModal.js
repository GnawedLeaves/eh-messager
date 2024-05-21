import { ThemeProvider } from "styled-components";
import { darktheme, lightTheme } from "../../theme";
import {
  MessageModalBlocker,
  MessageModalContainer,
  MessageModalOption,
} from "./MessageModalStyles";
import { useEffect } from "react";
import { useState } from "react";

const MessageModal = (props) => {
  // useEffect(() => {
  //   console.log("props.messageModalX", props.messageModalX);
  //   console.log("props.messageModalY", props.messageModalY);
  // }, [props]);
  return (
    <ThemeProvider theme={props.themeMode === "light" ? lightTheme : darktheme}>
      <MessageModalBlocker
        show={props.show}
        onClick={() => {
          props.handleBlockerClicked();
          console.log("CLicked");
        }}
      ></MessageModalBlocker>
      <MessageModalContainer
        show={props.show}
        messageModalX={props.messageModalX}
        messageModalY={props.messageModalY}
      >
        <MessageModalOption
          onClick={() => {
            props.handleReply();
            props.handleBlockerClicked();
          }}
        >
          Reply
        </MessageModalOption>
        <MessageModalOption
          onClick={() => {
            props.handleBlockerClicked();
            console.log("Delete clicked");
          }}
        >
          Delete
        </MessageModalOption>
      </MessageModalContainer>
    </ThemeProvider>
  );
};

export default MessageModal;
