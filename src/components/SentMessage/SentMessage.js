import { ThemeProvider } from "styled-components";
import {
  SentMessageBubble,
  SentMessageContainer,
  SentMessageDate,
  SentMessageMedia,
  SentMessageTickContainer,
} from "./SentMessageStyles";
import { darktheme, lightTheme } from "../../theme";
import { handleFirebaseDate } from "../../database/handleFirebaseDate";
import { IoCheckmark } from "react-icons/io5";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { UserContext } from "../../App";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import MessageModal from "../MessageModal/MessageModal";
import { RecievedMessageReplyContainer } from "../RecievedMessage/RecievedMessageStyles";

const SentMessage = ({ message, index, handleReply, conversationData }) => {
  const {
    id,
    date_created,
    message_body,
    attachment_url,
    parent_message_id,
    is_read,
  } = message;
  const user = useContext(UserContext);

  const getDateFromFirebaseDate = (date) => {
    return handleFirebaseDate(date).substring(5);
  };

  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [messageModalX, setMessageModalX] = useState(0);
  const [messageModalY, setMessageModalY] = useState(0);
  const [parentMessageContent, setParentMessageContent] = useState(null);

  const handleBlockerClicked = () => {
    setOpenMessageModal(false);
  };

  useEffect(() => {
    if (parent_message_id !== null) {
      getParentMessage();
    }
  }, [parent_message_id]);

  const getParentMessage = () => {
    const parentMessage = conversationData.filter((message) => {
      console.log("message", message);
      return message.id === parent_message_id;
    });
    setParentMessageContent(parentMessage[0]);
    console.log("parentMessage", parentMessage[0]);
  };

  return (
    <ThemeProvider theme={user?.themeMode === "light" ? lightTheme : darktheme}>
      <MessageModal
        themeMode={user?.themeMode}
        show={openMessageModal}
        handleBlockerClicked={handleBlockerClicked}
        messageModalX={messageModalX}
        messageModalY={messageModalY}
        handleReply={() => {
          handleReply({ id: id, message_body: message_body });
        }}
      />
      <SentMessageContainer>
        {message.attachment_url ? (
          <>
            <SentMessageDate>
              {getDateFromFirebaseDate(date_created)}
            </SentMessageDate>
            <SentMessageMedia
              onClick={() => {
                window.open(attachment_url, "_blank", "noopener");
              }}
              src={attachment_url}
              poster={attachment_url}
            />
          </>
        ) : (
          <></>
        )}
        <SentMessageDate>
          {getDateFromFirebaseDate(date_created)}
        </SentMessageDate>
        <SentMessageBubble
          onClick={(e) => {
            setOpenMessageModal(true);
            setMessageModalX(e.clientX);
            setMessageModalY(e.clientY);
          }}
        >
          {parent_message_id !== null ? (
            <RecievedMessageReplyContainer>
              Replying to: {parentMessageContent?.message_body}
            </RecievedMessageReplyContainer>
          ) : (
            <></>
          )}

          {message_body}
          <SentMessageTickContainer>
            {is_read ? (
              <IoCheckmarkDoneOutline size={"16px"} color={lightTheme.white} />
            ) : (
              <IoCheckmark size={"16px"} color={lightTheme.white} />
            )}
          </SentMessageTickContainer>
        </SentMessageBubble>
      </SentMessageContainer>
    </ThemeProvider>
  );
};

export default SentMessage;
