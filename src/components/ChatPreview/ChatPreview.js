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
import { darktheme, lightTheme, theme } from "../../theme";
import { IoCheckmark } from "react-icons/io5";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { LuClock4 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const ChatPreview = (props) => {
  const 他妈的 = "hello";
  const navigate = useNavigate();
  return (
    <ThemeProvider theme={props.themeMode === "light" ? lightTheme : darktheme}>
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
            <IoCheckmarkDoneOutline size={"20px"} color={lightTheme().grey} />
          ) : (
            <IoCheckmark size={"20px"} color={lightTheme().grey} />
          )}
        </ChatPreviewReadContainer>

        <ChatPreviewCountReadTimeGroup>
          <ChatPreviewMessageTimeContainer>
            {props.time}
          </ChatPreviewMessageTimeContainer>

          <ChatPreviewMessageCount
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
