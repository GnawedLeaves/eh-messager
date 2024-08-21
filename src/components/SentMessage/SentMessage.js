import { ThemeProvider } from "styled-components";
import {
  SentMessageBodyAndTick,
  SentMessageBubble,
  SentMessageContainer,
  SentMessageDate,
  SentMessageMedia,
  SentMessageReplyContainer,
  SentMessageReplyUsername,
  SentMessageTickContainer,
} from "./SentMessageStyles";
import { darktheme, LightTheme } from "../../theme";
import { handleFirebaseDate } from "../../database/handleFirebaseDate";
import { IoCheckmark } from "react-icons/io5";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { UserContext } from "../../App";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import MessageModal from "../MessageModal/MessageModal";
import {
  RecievedMessageReplyContainer,
  RecievedMessageReplyUsername,
} from "../RecievedMessage/RecievedMessageStyles";

const SentMessage = ({
  message,
  index,
  handleReply,
  conversationData,
  allUserData,
  handleDeleteMessage,
}) => {
  const {
    id,
    date_created,
    message_body,
    attachment_url,
    parent_message_id,
    is_read,
    creator_id,
    username,
  } = message;
  const user = useContext(UserContext);

  const getDateFromFirebaseDate = (date) => {
    return handleFirebaseDate(date).substring(5);
  };

  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [messageModalX, setMessageModalX] = useState(0);
  const [messageModalY, setMessageModalY] = useState(0);
  const [parentMessageContent, setParentMessageContent] = useState(null);
  const [parentMessageUsername, setParentMessageUsername] = useState("");
  const [creatorData, setCreatorData] = useState("");

  const handleBlockerClicked = () => {
    setOpenMessageModal(false);
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
    const parentMessage = conversationData.filter((message) => {
      return message.id === parent_message_id;
    });
    const parentMessageCreatorUsername = allUserData.filter((user) => {
      return user.userId === parentMessage[0].creator_id;
    });

    setParentMessageContent({
      message: parentMessage[0],
      creatorData: parentMessageCreatorUsername[0],
    });
    setParentMessageUsername(parentMessageCreatorUsername[0].username);
  };

  const getCreatorData = () => {
    //geting creator data
    const creatorData = allUserData.filter((user) => {
      return user.userId === creator_id;
    });
    console.log("creatorData", creatorData[0].username);
    setCreatorData(creatorData[0]);
  };
  return (
    <ThemeProvider theme={user?.themeMode === "light" ? LightTheme : darktheme}>
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
      <SentMessageContainer>
        <SentMessageDate>
          {getDateFromFirebaseDate(date_created)}
        </SentMessageDate>
        <SentMessageBubble
          onClick={(e) => {
            setOpenMessageModal(true);
            setMessageModalX(e.clientX);
            setMessageModalY(e.clientY);
          }}
        >
          {parent_message_id !== null ? (
            <SentMessageReplyContainer>
              <SentMessageReplyUsername>
                {parentMessageContent?.creatorData.username}
              </SentMessageReplyUsername>
              {parentMessageContent?.message.message_body}
            </SentMessageReplyContainer>
          ) : (
            <></>
          )}
          {message.attachment_url ? (
            <>
              <SentMessageMedia
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
          <SentMessageBodyAndTick>
            {message_body}
            <SentMessageTickContainer>
              {is_read ? (
                <IoCheckmarkDoneOutline
                  size={"16px"}
                  color={LightTheme().white}
                />
              ) : (
                <IoCheckmark size={"16px"} color={LightTheme().white} />
              )}
            </SentMessageTickContainer>
          </SentMessageBodyAndTick>
        </SentMessageBubble>
      </SentMessageContainer>
    </ThemeProvider>
  );
};

export default SentMessage;
