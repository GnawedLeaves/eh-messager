import { ThemeProvider } from "styled-components";
import {
  AdminAdminRecievedMessageDate,
  AdminAdminSentMessageDate,
  AdminMessageArrowContainer,
  AdminMessageArrowContainerBig,
  AdminMessageArrowContainerSmall,
  AdminMessageAttachmentPreview,
  AdminMessageAttachmentPreviewIcon,
  AdminMessageInput,
  AdminMessageInputBar,
  AdminMessagingContainer,
  AdminMessagingDisplayContainer,
  AdminRecievedMessage,
  AdminRecievedMessageContainer,
  AdminSentMessage,
  AdminSentMessageContainer,
  ChatboxHeader,
  ChatboxLoading,
} from "./ChatboxStyles2";
import { useState } from "react";
import { useEffect } from "react";
import { IoMdAttach, IoMdSend } from "react-icons/io";
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
import { sendMessageToUser } from "../../database/functions/sendMessageToUser";
import { RxCross2 } from "react-icons/rx";
import { AdminRecievedMessageMedia } from "../Chatbox/ChatboxStyles";
import { getAllMessageFromUser } from "../../database/functions/getAllMessageFromUser";

const Chatbox2 = (props) => {
  const [inputFocused, setInputFocused] = useState(false);
  const messageDisplayRef = useRef(null);
  const fileInputRef = useRef(null);
  const [messageFile, setMessageFile] = useState(null);
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
      sendMessage();
      // Perform actions when Enter key is pressed
    }
  };

  //Get messages from database and display them
  const getRecievedMessages = async (recipientId, senderId) => {};

  const getSentMessages = async (recipientId, senderId) => {};

  const getAllMessages = async (recipientId, senderId) => {};

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

  const handleIconClick = () => {
    setMessageFile(null);
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setMessageFile(file);
    console.log("file", file);
  };

  const sendMessage = async () => {
    await sendMessageToUser(userId, otherPersonId, messageContent, messageFile);
    setMessageContent("");
  };

  useEffect(() => {
    getAllMessageFromUser(userId, otherPersonId);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <AdminMessagingContainer>
        <ChatboxHeader>{otherPersonId}</ChatboxHeader>
        <AdminMessagingDisplayContainer ref={messageDisplayRef}>
          {allMessagesData && allMessagesData.length > 0 ? (
            allMessagesData.map((message, index) => {
              if (message.recipientId === userId) {
                return (
                  <AdminRecievedMessageContainer key={index}>
                    <AdminAdminRecievedMessageDate>
                      {getDateFromFirebaseDate(message.dateAdded)}
                    </AdminAdminRecievedMessageDate>
                    <AdminRecievedMessageMedia
                      onClick={() => {
                        window.open(
                          message.attachmentUrl,
                          "_blank",
                          "noopener"
                        );
                      }}
                      src={message.attachmentUrl}
                      poster={message.attachmentUrl}
                    />
                    <AdminRecievedMessage>
                      {message.messageBody}
                    </AdminRecievedMessage>
                  </AdminRecievedMessageContainer>
                );
              } else {
                return (
                  <AdminSentMessageContainer key={index}>
                    <AdminAdminSentMessageDate>
                      {getDateFromFirebaseDate(message.dateAdded)}
                    </AdminAdminSentMessageDate>
                    <AdminSentMessage>{message.messageBody}</AdminSentMessage>
                  </AdminSentMessageContainer>
                );
              }
            })
          ) : (
            <ChatboxLoading>No Messages Yet</ChatboxLoading>
          )}
        </AdminMessagingDisplayContainer>
        <AdminMessageAttachmentPreview
          transformValue={messageFile ? "-2.5rem" : "1rem"}
        >
          Attached File: {messageFile ? messageFile.name : ""}
          <AdminMessageAttachmentPreviewIcon
            onClick={() => {
              setMessageFile(null);
            }}
          >
            <RxCross2 size={"1.4rem"} />
          </AdminMessageAttachmentPreviewIcon>
        </AdminMessageAttachmentPreview>
        <AdminMessageInputBar>
          <AdminMessageAttachmentPreview
            transformValue={messageFile ? "-4.5rem" : "3rem"}
          >
            Attached File: {messageFile ? messageFile.name : ""}
            <AdminMessageAttachmentPreviewIcon
              onClick={() => {
                setMessageFile(null);
              }}
            >
              <RxCross2 size={"1.4rem"} />
            </AdminMessageAttachmentPreviewIcon>
          </AdminMessageAttachmentPreview>
          <AdminMessageInput
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
          <AdminMessageArrowContainerBig>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              style={{
                display: "none",
              }}
            />
            <AdminMessageArrowContainerSmall onClick={handleIconClick}>
              <IoMdAttach size="2rem" style={{ transform: "rotate(45deg)" }} />
            </AdminMessageArrowContainerSmall>
            <AdminMessageArrowContainerSmall
              onClick={async () => {
                sendMessage();
              }}
            >
              <IoMdSend size="2rem" />
            </AdminMessageArrowContainerSmall>
          </AdminMessageArrowContainerBig>
        </AdminMessageInputBar>
      </AdminMessagingContainer>
    </ThemeProvider>
  );
};
export default Chatbox2;
