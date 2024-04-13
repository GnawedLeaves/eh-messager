import React from "react";
import { OpenChatPageContainer } from "./OpenChatPageStyles";
import { useNavigate, useParams } from "react-router-dom";

const OpenChatPage = () => {
  const { chatId } = useParams();

  return (
    <OpenChatPageContainer>
      chatid: {chatId}
      Open Chat Page
    </OpenChatPageContainer>
  );
};

export default OpenChatPage;
