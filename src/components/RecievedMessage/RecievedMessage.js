import { ThemeProvider } from "styled-components";
import {
  RecievedMessageBubble,
  RecievedMessageContainer,
  RecievedMessageDate,
  RecievedMessageMedia,
} from "./RecievedMessageStyles";
import { lightTheme } from "../../theme";
import { useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../database/firebase";
import { handleFirebaseDate } from "../../database/handleFirebaseDate";

const RecievedMessage = ({ message, index }) => {
  const {
    id,
    date_created,
    message_body,
    attachment_url,
    is_read,
    message_recipient_id,
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

  return (
    <ThemeProvider theme={lightTheme}>
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
        <RecievedMessageBubble>{message_body}</RecievedMessageBubble>
      </RecievedMessageContainer>
    </ThemeProvider>
  );
};

export default RecievedMessage;
