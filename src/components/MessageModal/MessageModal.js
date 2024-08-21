import { ThemeProvider } from "styled-components";
import { darktheme, LightTheme } from "../../theme";
import {
  MessageModalBlocker,
  MessageModalContainer,
  MessageModalOption,
} from "./MessageModalStyles";
import { useEffect } from "react";
import { useState } from "react";

const MessageModal = (props) => {
  return (
    <ThemeProvider theme={props.themeMode === "light" ? LightTheme : darktheme}>
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
            props.handleDeleteMessage();
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
