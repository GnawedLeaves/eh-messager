import { ThemeProvider } from "styled-components";
import {
  SentMessageBubble,
  SentMessageContainer,
  SentMessageDate,
  SentMessageMedia,
  SentMessageTickContainer,
} from "./SentMessageStyles";
import { darktheme, lightTheme } from "../../theme";
import { handleFirebaseDate } from "../../database/handleFirebaseDate";
import { IoCheckmark } from "react-icons/io5";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { UserContext } from "../../App";
import { useContext } from "react";

const SentMessage = ({ message, index }) => {
  const { id, date_created, message_body, attachment_url, is_read } = message;
  const user = useContext(UserContext);

  const getDateFromFirebaseDate = (date) => {
    return handleFirebaseDate(date).substring(5);
  };
  return (
    <ThemeProvider theme={user?.themeMode === "light" ? lightTheme : darktheme}>
      <SentMessageContainer>
        {message.attachment_url ? (
          <>
            <SentMessageDate>
              {getDateFromFirebaseDate(date_created)}
            </SentMessageDate>
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
        <SentMessageDate>
          {getDateFromFirebaseDate(date_created)}
        </SentMessageDate>
        <SentMessageBubble>
          {message_body}
          <SentMessageTickContainer>
            {is_read ? (
              <IoCheckmarkDoneOutline size={"16px"} color={lightTheme.white} />
            ) : (
              <IoCheckmark size={"16px"} color={lightTheme.white} />
            )}
          </SentMessageTickContainer>
        </SentMessageBubble>
      </SentMessageContainer>
    </ThemeProvider>
  );
};

export default SentMessage;
