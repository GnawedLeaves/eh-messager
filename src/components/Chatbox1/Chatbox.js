import { ThemeProvider } from "styled-components";
import {
  RecievedMessageDate,
  SentMessageDate,
  MessageArrowContainer,
  MessageInput,
  MessageInputBar,
  MessagingContainer,
  RecievedMessage,
  RecievedMessageContainer,
  SentMessage,
  SentMessageContainer,
  ChatboxHeader,
  ChatboxLoading,
  MessagingDisplayContainer,
} from "./ChatboxStyles";
import { useState } from "react";
import { useEffect } from "react";
import { IoMdSend } from "react-icons/io";
import { useRef } from "react";
import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { theme } from "../../theme";
import { sortByFirebaseTimestamp } from "../../functions/sortArray";
import { db } from "../../database/firebase";
import { handleFirebaseDate } from "../../database/handleFirebaseDate";

const Chatbox = (props) => {
  const [inputFocused, setInputFocused] = useState(false);
  const messageDisplayRef = useRef(null);

  const [messageContent, setMessageContent] = useState("");
  const [allMessagesData, setAllMessagesData] = useState([]);
  const userId = props.userId ? props.userId : "1";
  const otherPersonId = props.otherPersonId ? props.otherPersonId : "2";

  const messagesRef = collection(db, "messages");

  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleBlur = () => {
    setInputFocused(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && inputFocused) {
      event.preventDefault();
      sendMessage(userId, otherPersonId);
      // Perform actions when Enter key is pressed
    }
  };

  const sendMessage = async (senderId, recipientId) => {
    if (messageContent !== "") {
      const currentDate = new Date();
      const timestamp = Timestamp.fromDate(currentDate);

      try {
        // Use the addDoc method to add a document and obtain the DocumentReference
        const messageDocRef = await addDoc(messagesRef, {
          messageBody: messageContent,
          senderId: senderId,
          recipientId: recipientId,
          dateAdded: timestamp,
        });

        // Access the generated ID from the DocumentReference
        const sentMessageId = messageDocRef.id;

        // try {
        //   const messageRecipientId = uuidv4();

        //   // Use the addDoc method for the second collection
        //   await addDoc(messageRecipientRef, {
        //     messageId: sentMessageId,
        //     recipientId: recipientId,
        //     dateAdded: timestamp,
        //   });

        //   console.log(
        //     "Message Recipient document added with ID:",
        //     messageRecipientId
        //   );
        // } catch (e) {
        //   console.log("Error sending message to message_recipient: ", e);
        // }
        setMessageContent("");
        getAllMessages(userId, otherPersonId);
      } catch (e) {
        console.log("Error sending message: ", e);
      }
    }
  };

  //Get messages from database and display them
  const getRecievedMessages = async (recipientId, senderId) => {
    try {
      // Create a query to get all messages where recipientId matches
      const messagesQuery = query(
        messagesRef,
        where("recipientId", "==", recipientId),
        where("senderId", "==", senderId)
      );

      // Get the documents based on the query
      const querySnapshot = await getDocs(messagesQuery);

      // Extract the data from the documents
      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return messages;
    } catch (error) {
      console.error("Error getting messages:", error);
      return [];
    }
  };

  const getSentMessages = async (recipientId, senderId) => {
    try {
      // Create a query to get all messages where recipientId matches
      const messagesQuery = query(
        messagesRef,
        where("recipientId", "==", senderId),
        where("senderId", "==", recipientId)
      );

      // Get the documents based on the query
      const querySnapshot = await getDocs(messagesQuery);

      // Extract the data from the documents
      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return messages;
    } catch (error) {
      console.error("Error getting messages:", error);
      return [];
    }
  };

  const getAllMessages = async (recipientId, senderId) => {
    const recivedMessages = await getRecievedMessages(recipientId, senderId);
    const sentMessages = await getSentMessages(recipientId, senderId);
    const allMessages = [...recivedMessages, ...sentMessages];
    const sortedArray = sortByFirebaseTimestamp(allMessages, "dateAdded");
    setAllMessagesData([...sortedArray]);
  };

  // When the component mounts, set the scrollTop property to the maximum scroll height

  useEffect(() => {
    scrollToBottom();
  }, [allMessagesData]);

  const scrollToBottom = () => {
    if (messageDisplayRef.current) {
      const scrollContainer = messageDisplayRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  };

  const getDateFromFirebaseDate = (date) => {
    return handleFirebaseDate(date).substring(5);
  };

  //updates the data array whenever the database changes
  useEffect(() => {
    const unsubscribe = onSnapshot(messagesRef, () => {
      getAllMessages(userId, otherPersonId);
    });

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <MessagingContainer>
        <ChatboxHeader>{otherPersonId}</ChatboxHeader>
        <MessagingDisplayContainer ref={messageDisplayRef}>
          {allMessagesData && allMessagesData.length > 0 ? (
            allMessagesData.map((message, index) => {
              if (message.recipientId === userId) {
                return (
                  <RecievedMessageContainer key={index}>
                    <RecievedMessageDate>
                      {getDateFromFirebaseDate(message.dateAdded)}
                    </RecievedMessageDate>
                    <RecievedMessage>{message.messageBody}</RecievedMessage>
                  </RecievedMessageContainer>
                );
              } else {
                return (
                  <SentMessageContainer key={index}>
                    <SentMessageDate>
                      {getDateFromFirebaseDate(message.dateAdded)}
                    </SentMessageDate>
                    <SentMessage>{message.messageBody}</SentMessage>
                  </SentMessageContainer>
                );
              }
            })
          ) : (
            <ChatboxLoading>No Messages Yet</ChatboxLoading>
          )}
        </MessagingDisplayContainer>
        <MessageInputBar>
          <MessageInput
            value={messageContent}
            rows="1"
            onKeyDown={handleKeyDown}
            type="text"
            onFocus={handleInputFocus}
            onBlur={handleBlur}
            onChange={(e) => {
              setMessageContent(e.target.value);
            }}
          />
          <MessageArrowContainer
            onClick={() => {
              sendMessage(userId, otherPersonId);
            }}
          >
            <IoMdSend size="1.5rem" />
          </MessageArrowContainer>
        </MessageInputBar>
      </MessagingContainer>
    </ThemeProvider>
  );
};
export default Chatbox;
