import { ThemeProvider } from "styled-components";
import {
  RecievedMessageBubble,
  RecievedMessageContainer,
  RecievedMessageDate,
  RecievedMessageMedia,
  RecievedMessageReplyContainer,
} from "./RecievedMessageStyles";
import { darktheme, lightTheme } from "../../theme";
import { useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../database/firebase";
import { handleFirebaseDate } from "../../database/handleFirebaseDate";
import { useContext } from "react";
import { UserContext } from "../../App";
import { useState } from "react";
import MessageModal from "../MessageModal/MessageModal";

const RecievedMessage = ({ message, index, handleReply, conversationData }) => {
  const user = useContext(UserContext);
  const {
    id,
    date_created,
    message_body,
    attachment_url,
    is_read,
    message_recipient_id,
    parent_message_id,
  } = message;

  // console.log("RecievedMessage", message);

  useEffect(() => {
    if (!is_read) {
      markAsRead(message_recipient_id);
    }
  }, [is_read]);

  const markAsRead = async (messageId) => {
    try {
      const messageRef = doc(db, "message_recipient", messageId);
      await updateDoc(messageRef, { is_read: true });
      console.log(`Message ${messageId} marked as read.`);
    } catch (error) {
      console.error("Error marking message as read: ", error);
    }
  };
  const getDateFromFirebaseDate = (date) => {
    return handleFirebaseDate(date).substring(5);
  };

  //message modal functions

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
      <RecievedMessageContainer>
        {message.attachment_url ? (
          <>
            <RecievedMessageDate>
              {getDateFromFirebaseDate(date_created)}
            </RecievedMessageDate>
            <RecievedMessageMedia
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
        <RecievedMessageDate>
          {getDateFromFirebaseDate(date_created)}
        </RecievedMessageDate>
        <RecievedMessageBubble
          onClick={(e) => {
            setOpenMessageModal(true);
            setMessageModalX(e.clientX);
            setMessageModalY(e.clientY);
          }}
        >
          {parent_message_id !== null ? (
            <RecievedMessageReplyContainer>
              {parentMessageContent?.message_body}
            </RecievedMessageReplyContainer>
          ) : (
            <></>
          )}
          {message_body}
        </RecievedMessageBubble>
      </RecievedMessageContainer>
    </ThemeProvider>
  );
};

export default RecievedMessage;
