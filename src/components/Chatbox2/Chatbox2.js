import { ThemeProvider } from "styled-components";
import {
  RecievedMessageDate,
  SentMessageDate,
  MessageArrowContainer,
  MessageArrowContainerBig,
  MessageArrowContainerSmall,
  MessageAttachmentPreview,
  MessageAttachmentPreviewIcon,
  MessageInput,
  MessageInputBar,
  MessagingContainer,
  MessagingDisplayContainer,
  RecievedMessageBubble,
  RecievedMessageContainer,
  SentMessage,
  SentMessageContainer,
  ChatboxHeader,
  ChatboxLoading,
  RecievedMessageOptionsModal,
  SentMessageOptionsModal,
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

import { lightTheme, theme } from "../../theme";
import { sortByFirebaseTimestamp } from "../../functions/sortArray";
import { db } from "../../database/firebase";
import { handleFirebaseDate } from "../../database/handleFirebaseDate";
import { sendMessageToUser } from "../../database/functions/sendMessageToUser";
import { RxCross2 } from "react-icons/rx";
import { RecievedMessageMedia } from "../Chatbox/ChatboxStyles";
import { getAllMessageFromUser } from "../../database/functions/getAllMessageIdsFromUser";
import { getAll } from "firebase/remote-config";
import { deleteMessageFromUser } from "../../database/functions/deleteMessageFromUser";
import RecievedMessage from "../RecievedMessage/RecievedMessage";

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
    if (messageContent !== "") {
      await sendMessageToUser(
        userId,
        otherPersonId,
        messageContent,
        messageFile,
        messageIdToReply
      );
      setMessageContent("");
      setMessageFile(null);
      setMessageIdToReply(null);
      initGetAllMessages();
    }
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
          messagesFetched.push({ id: snapshot.id, ...snapshot.data() });
        }
      });
    }

    const sortedArray = sortByFirebaseTimestamp(
      messagesFetched,
      "date_created"
    );
    console.log("All Messages", sortedArray);
    setAllMessagesData(sortedArray);
  };

  // Reply functions
  const [showMessageOptionsModal, setShowMessageOptionsModal] = useState(true);
  const [messageClickedIndex, setMessageClickedIndex] = useState(-1);
  const [messageIdToReply, setMessageIdToReply] = useState(null);

  const getParentMessagePreview = (messageId) => {
    const parentMessageObj = allMessagesData.filter(
      (message) => message.id === messageId
    );
    return parentMessageObj;
  };

  //Delete message function
  const deleteMessage = async (messageId, attachmentName) => {
    deleteMessageFromUser(messageId, attachmentName);
    initGetAllMessages();
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <MessagingContainer>
        <ChatboxHeader>{otherPersonId}</ChatboxHeader>
        <MessagingDisplayContainer ref={messageDisplayRef}>
          {allMessagesData && allMessagesData.length > 0 ? (
            allMessagesData.map((message, index) => {
              if (message.creator_id !== userId) {
                return (
                  <>
                    <RecievedMessage
                      key={index + 1 * Math.PI}
                      message={message}
                    />
                    <RecievedMessageContainer key={index}>
                      {message.attachment_url ? (
                        <>
                          <RecievedMessageDate>
                            {getDateFromFirebaseDate(message.date_created)}
                          </RecievedMessageDate>
                          <RecievedMessageMedia
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
                      <RecievedMessageDate>
                        {getDateFromFirebaseDate(message.date_created)}
                      </RecievedMessageDate>
                      <RecievedMessageBubble
                        onClick={() => {
                          if (messageClickedIndex === index) {
                            setMessageClickedIndex(-1);
                          } else {
                            setMessageClickedIndex(index);
                          }
                        }}
                      >
                        <RecievedMessageOptionsModal
                          display={messageClickedIndex === index}
                        >
                          <button
                            onClick={() => {
                              setMessageIdToReply(message.id);
                            }}
                          >
                            Reply
                          </button>
                          <button
                            onClick={() => {
                              deleteMessage(
                                message.id,
                                message.attachment_name
                              );
                            }}
                          >
                            Delete
                          </button>
                        </RecievedMessageOptionsModal>
                        {message.parent_message_id !== null ? (
                          <>
                            {getParentMessagePreview(
                              message.parent_message_id
                            ).map(
                              (message) =>
                                "Replying to: " + message.message_body
                            )}
                            <br />
                            <br />
                          </>
                        ) : (
                          <></>
                        )}
                        {message.message_body}
                      </RecievedMessageBubble>
                    </RecievedMessageContainer>
                  </>
                );
              } else {
                return (
                  <SentMessageContainer key={index}>
                    {message.attachment_url ? (
                      <>
                        <RecievedMessageDate>
                          {getDateFromFirebaseDate(message.date_created)}
                        </RecievedMessageDate>
                        <RecievedMessageMedia
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
                    <SentMessageDate>
                      {getDateFromFirebaseDate(message.date_created)}
                    </SentMessageDate>
                    <SentMessage
                      onClick={() => {
                        if (messageClickedIndex === index) {
                          setMessageClickedIndex(-1);
                        } else {
                          setMessageClickedIndex(index);
                        }
                      }}
                    >
                      <SentMessageOptionsModal
                        display={messageClickedIndex === index}
                      >
                        <button
                          onClick={() => {
                            setMessageIdToReply(message.id);
                          }}
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => {
                            deleteMessage(message.id, message.attachment_name);
                          }}
                        >
                          Delete
                        </button>
                      </SentMessageOptionsModal>
                      {message.parent_message_id !== null ? (
                        <>
                          {getParentMessagePreview(
                            message.parent_message_id
                          ).map(
                            (message) => "Replying to: " + message.message_body
                          )}
                          <br />
                          <br />
                        </>
                      ) : (
                        <></>
                      )}
                      {message.message_body}
                    </SentMessage>
                  </SentMessageContainer>
                );
              }
            })
          ) : (
            <ChatboxLoading>No Messages Yet</ChatboxLoading>
          )}
        </MessagingDisplayContainer>

        <MessageInputBar>
          <MessageAttachmentPreview
            transformValue={messageFile ? "-4.5rem" : "3rem"}
          >
            Attached File: {messageFile ? messageFile.name : ""}
            <MessageAttachmentPreviewIcon
              onClick={() => {
                setMessageFile(null);
              }}
            >
              <RxCross2 size={"1.4rem"} />
            </MessageAttachmentPreviewIcon>
          </MessageAttachmentPreview>
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
          <MessageArrowContainerBig>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              style={{
                display: "none",
              }}
            />
            <MessageArrowContainerSmall onClick={handleIconClick}>
              <IoMdAttach size="2rem" style={{ transform: "rotate(45deg)" }} />
            </MessageArrowContainerSmall>
            <MessageArrowContainerSmall
              onClick={async () => {
                sendMessage();
              }}
            >
              <IoMdSend size="2rem" />
            </MessageArrowContainerSmall>
          </MessageArrowContainerBig>
        </MessageInputBar>
      </MessagingContainer>
    </ThemeProvider>
  );
};
export default Chatbox2;
