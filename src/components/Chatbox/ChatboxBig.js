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
  MessageInputBarBig,
  MessageInputBig,
  MessagingContainer,
  MessagingContainerBig,
  MessagingDisplayContainer,
  MessagingDisplayContainerBig,
  RecievedMessage,
  RecievedMessageContainer,
  RecievedMessageMedia,
  SentMessage,
  SentMessageContainer,
  ChatboxHeader,
  ChatboxHeaderBig,
  ChatboxLoading,
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
import { db, storage } from "../../backend/firebase/firebase";
import { sortByFirebaseTimestamp } from "../../functions/sortArray";
import { handleFirebaseDate } from "../../backend/firebase/handleFirebaseDate";
import { IoMdAttach } from "react-icons/io";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { RxCross2 } from "react-icons/rx";

const ChatboxBig = (props) => {
  const [inputFocused, setInputFocused] = useState(false);
  const messageDisplayRef = useRef(null);

  const [messageContent, setMessageContent] = useState("");
  const [messageFile, setMessageFile] = useState(null);
  const [allMessagesData, setAllMessagesData] = useState([]);
  const userId = props.userId ? props.userId : "1";
  let otherPersonId = props.otherPersonId ? props.otherPersonId : "2";
  let otherPersonName = props.otherPersonName
    ? props.otherPersonName
    : "Name Not Available";

  const fileInputRef = useRef(null);

  useEffect(() => {
    otherPersonId = props.otherPersonId;
    otherPersonName = props.otherPersonName;
  }, [props]);

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
    if (messageContent !== "" || messageFile !== null) {
      const currentDate = new Date();
      const timestamp = Timestamp.fromDate(currentDate);

      try {
        let attachmentUrl = null;

        // Check if an attachment is provided
        if (messageFile) {
          // Get a reference to the storage location and the path where the file is saved
          const fileRef = ref(storage, `messages/${messageFile}`);

          // Upload the file to Firebase Storage
          await uploadBytes(fileRef, messageFile);

          // Get the download URL of the uploaded file
          attachmentUrl = await getDownloadURL(fileRef);

          console.log("File uploaded successfully!", attachmentUrl);
          setMessageFile(null);
        }
        // Use the addDoc method to add a document and obtain the DocumentReference
        const messageDocRef = await addDoc(messagesRef, {
          messageBody: messageContent,
          senderId: senderId,
          recipientId: recipientId,
          dateAdded: timestamp,
          attachmentUrl: attachmentUrl,
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
    console.log("allMessagesData", allMessagesData);
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
  }, [props.otherPersonId]);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setMessageFile(file);
    console.log("file", file);
  };

  return (
    <ThemeProvider theme={theme}>
      <MessagingContainerBig>
        <ChatboxHeaderBig>{otherPersonName}</ChatboxHeaderBig>
        <MessagingDisplayContainerBig ref={messageDisplayRef}>
          {allMessagesData && allMessagesData.length > 0 ? (
            allMessagesData.map((message, index) => {
              if (message.recipientId === userId) {
                return (
                  <RecievedMessageContainer key={index}>
                    {message.attachmentUrl ? (
                      <>
                        <RecievedMessageDate>
                          {getDateFromFirebaseDate(message.dateAdded)}
                        </RecievedMessageDate>

                        <RecievedMessageMedia
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
                      </>
                    ) : (
                      ""
                    )}
                    {message.messageBody ? (
                      <>
                        <RecievedMessageDate>
                          {getDateFromFirebaseDate(message.dateAdded)}
                        </RecievedMessageDate>
                        <RecievedMessage>
                          {message.questionCategory ? (
                            <b>
                              {message.questionCategory} <br />
                            </b>
                          ) : (
                            ""
                          )}
                          {message.messageBody}
                        </RecievedMessage>
                      </>
                    ) : (
                      <></>
                    )}
                  </RecievedMessageContainer>
                );
              } else {
                return (
                  <SentMessageContainer key={index}>
                    {message.attachmentUrl ? (
                      <>
                        <SentMessageDate>
                          {getDateFromFirebaseDate(message.dateAdded)}
                        </SentMessageDate>
                        <RecievedMessageMedia
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
                      </>
                    ) : (
                      ""
                    )}

                    {message.messageBody ? (
                      <>
                        <SentMessageDate>
                          {getDateFromFirebaseDate(message.dateAdded)}
                        </SentMessageDate>
                        <SentMessage>
                          {message.questionCategory ? (
                            <b>
                              {message.questionCategory} <br />
                            </b>
                          ) : (
                            ""
                          )}
                          {message.messageBody}
                        </SentMessage>{" "}
                      </>
                    ) : (
                      <></>
                    )}
                    {/* <SentMessage>{message.messageBody}</SentMessage> */}
                  </SentMessageContainer>
                );
              }
            })
          ) : (
            <ChatboxLoading>No Messages Yet</ChatboxLoading>
          )}
        </MessagingDisplayContainerBig>
        <MessageInputBarBig>
          <MessageAttachmentPreview
            transformValue={messageFile ? "-2.5rem" : "1rem"}
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
          <MessageInputBig
            value={messageContent}
            rows="1"
            onKeyDown={handleKeyDown}
            type="text"
            onFocus={handleInputFocus}
            onBlur={handleBlur}
            placeholder="Write a message..."
            onChange={(e) => {
              setMessageContent(e.target.value);
            }}
          />
          {/* <MessageArrowContainerBig
            onClick={() => {
              sendMessage(userId, otherPersonId);
            }}
          >
            <IoMdAttach size="1.5rem" />
          </MessageArrowContainerBig> */}

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
              onClick={() => {
                sendMessage(userId, otherPersonId);
              }}
            >
              <IoMdSend size="2rem" />
            </MessageArrowContainerSmall>
          </MessageArrowContainerBig>
        </MessageInputBarBig>
      </MessagingContainerBig>
    </ThemeProvider>
  );
};
export default ChatboxBig;
