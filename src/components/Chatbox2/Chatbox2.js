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
  SentMessageBubble,
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
import SentMessage from "../SentMessage/SentMessage";

const Chatbox2 = (props) => {
  const [inputFocused, setInputFocused] = useState(false);
  const messageDisplayRef = useRef(null);
  const fileInputRef = useRef(null);
  const [messageFile, setMessageFile] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [allMessagesData, setAllMessagesData] = useState([]);
  const [allMessagesIdsObjs, setAllMessagesIdsObjs] = useState([]);
  const userId = props.userId ? props.userId : "1";
  const otherPersonId = props.otherPersonId ? props.otherPersonId : null;

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
      // initGetAllMessages()
      getEverything();
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
      // getEverything();
      scrollToBottom();
    }
  };

  const [allMessages, setAllMessages] = useState([]);
  const [allRecievedMessages, setAllRecievedMessages] = useState([]);

  const [allCombinedMessages, setAllCombinedMessages] = useState([]);

  const [conversationData, setConversationData] = useState([]);

  const [otherUserData, setOtherUserData] = useState({});

  const getAllMessages = async () => {
    let allMessages = [];
    const querySnapshot = await getDocs(collection(db, "message"));
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      allMessages = [...allMessages, { id: doc.id, ...docData }];
    });

    setAllMessages(allMessages);
  };

  const getAllRecievedMessages = async () => {
    let allRecievedMessages = [];
    const querySnapshot = await getDocs(collection(db, "message_recipient"));
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      allRecievedMessages = [
        ...allRecievedMessages,
        { message_recipient_id: doc.id, ...docData },
      ];
    });
    setAllRecievedMessages(allRecievedMessages);
  };

  const getOtherUserData = async () => {
    let otherPersonData = {};
    const docRef = doc(db, "users", otherPersonId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      otherPersonData = { ...docSnap.data(), userId: docSnap.id };

      setOtherUserData(otherPersonData);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  const combineMessages = () => {
    const mapA = new Map(
      allRecievedMessages.map((item) => [item.message_id, item])
    );
    const mergedArray = allMessages.map((itemB) => {
      const matchingItemA = mapA.get(itemB.id);

      if (matchingItemA) {
        return { ...itemB, ...matchingItemA }; // Combine the objects
      }
      return itemB; // If no match is found, keep the original item from arrayB
    });

    setAllCombinedMessages(mergedArray);
    getConversation(mergedArray);
  };

  const getConversation = (allCombinedMessages) => {
    let recievedMessages = allCombinedMessages.filter(
      (message) =>
        message.creator_id === otherPersonId && message.recipient_id === userId
    );

    let sentMessages = allCombinedMessages.filter(
      (message) =>
        message.creator_id === userId && message.recipient_id === otherPersonId
    );

    let recievedAndSentMessages = [...recievedMessages, ...sentMessages];

    const sortedArray = sortByFirebaseTimestamp(
      recievedAndSentMessages,
      "date_created"
    );

    setConversationData(sortedArray);
    scrollToBottom();
    console.log("Conversation Data", sortedArray);
  };

  const getEverything = () => {
    getAllMessages();
    getAllRecievedMessages();
    scrollToBottom();
  };

  useEffect(() => {
    if (otherPersonId !== null && otherPersonId !== undefined) {
      getEverything();
      getOtherUserData();
      console.log("otherPersonId", otherPersonId);
      console.count("API called");
    }
  }, []);

  useEffect(() => {
    combineMessages();
  }, [allRecievedMessages, allMessages]);

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
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <MessagingContainer>
        <ChatboxHeader>{otherUserData.username}</ChatboxHeader>
        <MessagingDisplayContainer ref={messageDisplayRef}>
          {conversationData.length > 0 ? (
            conversationData.map((message, index) => {
              if (message.creator_id !== userId) {
                return (
                  <RecievedMessage
                    key={index}
                    message={message}
                    index={index}
                  />
                );
              } else {
                return (
                  <SentMessage key={index} message={message} index={index} />
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
