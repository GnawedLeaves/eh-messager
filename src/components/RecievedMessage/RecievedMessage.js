import { ThemeProvider } from "styled-components";
import {
  RecievedMessageBubble,
  RecievedMessageContainer,
  RecievedMessageDate,
  RecievedMessageMedia,
  RecievedMessageReplyContainer,
  RecievedMessageReplyUsername,
} from "./RecievedMessageStyles";
import { darktheme, LightTheme } from "../../theme";
import { useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../database/firebase";
import { handleFirebaseDate } from "../../database/handleFirebaseDate";
import { useContext } from "react";
import { UserContext } from "../../App";
import { useState } from "react";
import MessageModal from "../MessageModal/MessageModal";
import { useRef } from "react";

const RecievedMessage = ({
  message,
  index,
  handleReply,
  conversationData,
  allUserData,
  handleDeleteMessage,
}) => {
  const user = useContext(UserContext);
  const {
    id,
    date_created,
    message_body,
    attachment_url,
    is_read,
    message_recipient_id,
    parent_message_id,
    creator_id,
    username,
  } = message;

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
  const [creatorData, setCreatorData] = useState("");

  const handleBlockerClicked = () => {
    setOpenMessageModal(false);
  };

  const handleOpenMessageModal = (e) => {
    setOpenMessageModal(true);
    setMessageModalX(e.clientX);
    setMessageModalY(e.clientY);
  };

  useEffect(() => {
    if (parent_message_id !== null) {
      getParentMessage();
    }
  }, [parent_message_id]);
  useEffect(() => {
    getCreatorData();
  }, []);

  const getParentMessage = () => {
    // Get the parent message
    const parentMessage = conversationData.filter((message) => {
      return message.id === parent_message_id;
    });

    // Check if the parent message is empty or undefined
    if (!parentMessage || parentMessage.length === 0) {
      setParentMessageContent({
        message: { message_body: "Message deleted" }, // Fallback for deleted message
        creatorData: { username: "Unknown" }, // Fallback for unknown user
      });
      return;
    }

    // Filter to get the username of the parent message creator
    const parentMessageCreatorUsername = allUserData.filter((user) => {
      return user.userId === parentMessage[0].creator_id;
    });

    // Set the content of the parent message
    setParentMessageContent({
      message: parentMessage[0]?.message_body
        ? parentMessage[0]
        : { message_body: "Message deleted" }, // Fallback for empty message body
      creatorData: parentMessageCreatorUsername[0] || { username: "Unknown" }, // Fallback for unknown user
    });
  };

  const getCreatorData = () => {
    //geting creator data
    const creatorData = allUserData.filter((user) => {
      return user.userId === creator_id;
    });

    setCreatorData(creatorData[0]);
  };

  //detect swipe
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const minSwipeDistance = 150;
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
    console.log("starting", e);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
    // console.log("Move", e);
  };

  const handleTouchEnd = (e) => {
    console.log("end", e);
    if (touchStartX - touchEndX > minSwipeDistance) {
      console.log("Swiped left");
      handleOpenMessageModal(e);
      // Add your swipe left handling logic here
    }
  };

  return (
    <ThemeProvider
      theme={
        user?.themeMode === "light"
          ? user?.selectedThemeData?.selectedThemeLight || LightTheme
          : user?.selectedThemeData?.selectedThemeDark || darktheme
      }
    >
      <MessageModal
        themeMode={user?.themeMode}
        show={openMessageModal}
        handleBlockerClicked={handleBlockerClicked}
        messageModalX={messageModalX}
        messageModalY={messageModalY}
        handleDeleteMessage={() => {
          handleDeleteMessage(id, attachment_url);
        }}
        handleReply={() => {
          handleReply({
            id: id,
            message_body: message_body,
            username: creatorData.username,
          });
        }}
      />
      <RecievedMessageContainer
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <RecievedMessageDate>
          {getDateFromFirebaseDate(date_created)}
        </RecievedMessageDate>
        <RecievedMessageBubble
          onClick={(e) => {
            handleOpenMessageModal(e);
          }}
        >
          {parent_message_id !== null ? (
            <RecievedMessageReplyContainer>
              <RecievedMessageReplyUsername>
                {parentMessageContent?.creatorData.username}
              </RecievedMessageReplyUsername>
              {parentMessageContent?.message.message_body.length > 30
                ? parentMessageContent.message.message_body.slice(0, 80) + "..."
                : parentMessageContent?.message.message_body}
            </RecievedMessageReplyContainer>
          ) : (
            <></>
          )}
          {message.attachment_url ? (
            <>
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
          {message_body}
        </RecievedMessageBubble>
      </RecievedMessageContainer>
    </ThemeProvider>
  );
};

export default RecievedMessage;
