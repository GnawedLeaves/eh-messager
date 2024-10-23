import { ThemeProvider } from "styled-components";
import {
  ChatPreviewContainer,
  ChatPreviewCountReadTimeGroup,
  ChatPreviewMessage,
  ChatPreviewMessageCount,
  ChatPreviewMessageTimeContainer,
  ChatPreviewName,
  ChatPreviewNameAndMessageGroup,
  ChatPreviewProfilePicContainer,
  ChatPreviewProfilePicture,
  ChatPreviewReadContainer,
} from "./ChatPreviewStyles";
import { darktheme, LightTheme, theme } from "../../theme";
import { IoCheckmark } from "react-icons/io5";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { LuClock4 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBestTextColor } from "../../functions/getBestTextColor";

const ChatPreview = (props) => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState({});
  useEffect(() => {
    console.log("props.theme", props.theme);
    if (props.theme) {
      setTheme(props.theme);
    }
  }, [props]);
  return (
    <ThemeProvider theme={theme}>
      <ChatPreviewContainer
        onClick={() => {
          navigate(`/chat/${props.otherPersonId}`);
        }}
      >
        <ChatPreviewProfilePicture
          src={props.profilePicture}
        ></ChatPreviewProfilePicture>
        <ChatPreviewNameAndMessageGroup>
          <ChatPreviewName>{props.name}</ChatPreviewName>
          <ChatPreviewMessage>{props.message}</ChatPreviewMessage>
        </ChatPreviewNameAndMessageGroup>

        <ChatPreviewReadContainer
          opacity={props.tempMessageType === "recieved" ? "0%" : "100%"}
        >
          {props.isRead ? (
            <IoCheckmarkDoneOutline size={"20px"} color={theme.primary} />
          ) : (
            <IoCheckmark size={"20px"} color={theme.primary} />
          )}
        </ChatPreviewReadContainer>

        <ChatPreviewCountReadTimeGroup>
          <ChatPreviewMessageTimeContainer>
            {props.time}
          </ChatPreviewMessageTimeContainer>

          <ChatPreviewMessageCount
            color={getBestTextColor(theme.primary)}
            opacity={
              props.unreadMessageCount === 0 || props.tempMessageType === "sent"
                ? "0%"
                : "100%"
            }
          >
            {props.unreadMessageCount > 999 ? "999+" : props.unreadMessageCount}
          </ChatPreviewMessageCount>
        </ChatPreviewCountReadTimeGroup>
      </ChatPreviewContainer>
    </ThemeProvider>
  );
};

export default ChatPreview;
