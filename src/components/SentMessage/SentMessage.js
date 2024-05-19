import { ThemeProvider } from "styled-components";
import {
  SentMessageBubble,
  SentMessageContainer,
  SentMessageDate,
  SentMessageMedia,
} from "./SentMessageStyles";
import { lightTheme } from "../../theme";
import { handleFirebaseDate } from "../../database/handleFirebaseDate";
import { IoCheckmark } from "react-icons/io5";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

const SentMessage = ({ message, index }) => {
  const { id, date_created, message_body, attachment_url, is_read } = message;

  const getDateFromFirebaseDate = (date) => {
    return handleFirebaseDate(date).substring(5);
  };
  return (
    <ThemeProvider theme={lightTheme}>
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
          <br />
          {is_read ? (
            <IoCheckmarkDoneOutline size={"20px"} color={lightTheme.white} />
          ) : (
            <IoCheckmark size={"20px"} color={lightTheme.white} />
          )}
        </SentMessageBubble>
      </SentMessageContainer>
    </ThemeProvider>
  );
};

export default SentMessage;
