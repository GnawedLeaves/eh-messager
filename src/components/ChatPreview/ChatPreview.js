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
import { lightTheme, theme } from "../../theme";
import { IoCheckmark } from "react-icons/io5";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { LuClock4 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const ChatPreview = (props) => {
  const 他妈的 = "hello";
  const navigate = useNavigate();
  return (
    <ThemeProvider theme={lightTheme}>
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

        <ChatPreviewReadContainer>
          {props.sentMessageStatus === "Read" ? (
            <IoCheckmarkDoneOutline size={"20px"} color={lightTheme.grey} />
          ) : props.sentMessageStatus === "Sent" ? (
            <IoCheckmark size={"20px"} color={lightTheme.grey} />
          ) : (
            <LuClock4 size={"16px"} color={lightTheme.grey} />
          )}
        </ChatPreviewReadContainer>

        <ChatPreviewCountReadTimeGroup>
          <ChatPreviewMessageTimeContainer>
            {props.time}
          </ChatPreviewMessageTimeContainer>
          <ChatPreviewMessageCount>
            {props.messageCount > 999 ? "999+" : props.messageCount}
          </ChatPreviewMessageCount>
        </ChatPreviewCountReadTimeGroup>
      </ChatPreviewContainer>
    </ThemeProvider>
  );
};

export default ChatPreview;
