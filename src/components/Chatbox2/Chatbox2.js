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
  Firestore,
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
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
import { getAllMessageFromUser } from "../../database/functions/getAllMessageIdsFromUser";
import { getAll } from "firebase/remote-config";

const Chatbox2 = (props) => {
  const [inputFocused, setInputFocused] = useState(false);
  const messageDisplayRef = useRef(null);
  const fileInputRef = useRef(null);
  const [messageFile, setMessageFile] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [allMessagesData, setAllMessagesData] = useState([]);
  const [allMessagesIdsObjs, setAllMessagesIdsObjs] = useState([]);
  const userId = props.userId ? props.userId : "1";
  const otherPersonId = props.otherPersonId ? props.otherPersonId : "2";

  const messagesRef = collection(db, "messages");
  const messageRef = collection(db, "message");

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
    const unsubscribe = onSnapshot(messageRef, () => {
      initGetAllMessages();
    });

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [props.otherPersonId]);

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

  const initGetAllMessages = async () => {
    const tempMessagesIds = await getAllMessageFromUser(userId, otherPersonId);
    setAllMessagesIdsObjs(tempMessagesIds);
    getMessagesData(tempMessagesIds);
  };

  const getMessagesData = async (messageObjs) => {
    const messageRef = collection(db, "message");
    let messagesFetched = [];

    const messageIds = messageObjs.map((message) => {
      return message.message_id;
    });
    console.log("messageIds", messageIds);

    // Firestore supports up to 10 IDs in an `in` query
    for (let i = 0; i < messageIds.length; i += 10) {
      const batch = messageIds.slice(i, i + 10);
      // Create references to each document ID
      const docsRef = batch.map((id) => doc(messageRef, id));
      // Query each document reference
      const queries = docsRef.map((docRef) => getDoc(docRef));
      const snapshots = await Promise.all(queries);
      snapshots.forEach((snapshot) => {
        if (snapshot.exists()) {
          messagesFetched.push(snapshot.data());
        }
      });
    }

    const sortedArray = sortByFirebaseTimestamp(
      messagesFetched,
      "date_created"
    );
    console.log("sortedArray", sortedArray);
    setAllMessagesData(sortedArray);
  };

  return (
    <ThemeProvider theme={theme}>
      <AdminMessagingContainer>
        <ChatboxHeader>{otherPersonId}</ChatboxHeader>
        <AdminMessagingDisplayContainer ref={messageDisplayRef}>
          {allMessagesData && allMessagesData.length > 0 ? (
            allMessagesData.map((message, index) => {
              if (message.creator_id !== userId) {
                return (
                  <AdminRecievedMessageContainer key={index}>
                    {message.attachment_url ? (
                      <>
                        <AdminAdminRecievedMessageDate>
                          {getDateFromFirebaseDate(message.date_created)}
                        </AdminAdminRecievedMessageDate>
                        <AdminRecievedMessageMedia
                          onClick={() => {
                            window.open(
                              message.attachment_url,
                              "_blank",
                              "noopener"
                            );
                          }}
                          src={message.attachment_url}
                          poster={message.attachment_url}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                    <AdminAdminRecievedMessageDate>
                      {getDateFromFirebaseDate(message.date_created)}
                    </AdminAdminRecievedMessageDate>
                    <AdminRecievedMessage>
                      {message.message_body}
                    </AdminRecievedMessage>
                  </AdminRecievedMessageContainer>
                );
              } else {
                return (
                  <AdminSentMessageContainer key={index}>
                    {message.attachment_url ? (
                      <>
                        <AdminAdminRecievedMessageDate>
                          {getDateFromFirebaseDate(message.date_created)}
                        </AdminAdminRecievedMessageDate>
                        <AdminRecievedMessageMedia
                          onClick={() => {
                            window.open(
                              message.attachment_url,
                              "_blank",
                              "noopener"
                            );
                          }}
                          src={message.attachment_url}
                          poster={message.attachment_url}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                    <AdminAdminSentMessageDate>
                      {getDateFromFirebaseDate(message.date_created)}
                    </AdminAdminSentMessageDate>
                    <AdminSentMessage>{message.message_body}</AdminSentMessage>
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
