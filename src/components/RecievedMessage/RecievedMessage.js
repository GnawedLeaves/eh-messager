import { ThemeProvider } from "styled-components";
import {
  RecievedMessageBubble,
  RecievedMessageContainer,
  RecievedMessageDate,
} from "./RecievedMessageStyles";
import { lightTheme } from "../../theme";
import { useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../database/firebase";
import { handleFirebaseDate } from "../../database/handleFirebaseDate";

const RecievedMessage = ({ message }) => {
  const { id, date_created, message_body } = message;

  useEffect(() => {
    // if (!isRead) {
    //   // markAsRead(id);
    // }
    console.log(message);
  }, [id]);

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
        <RecievedMessageDate>
          {getDateFromFirebaseDate(date_created)}
        </RecievedMessageDate>
        <RecievedMessageBubble>{message_body}</RecievedMessageBubble>
      </RecievedMessageContainer>
    </ThemeProvider>
  );
};

export default RecievedMessage;
