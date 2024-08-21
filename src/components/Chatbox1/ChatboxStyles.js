import styled from "styled-components";

export const MessagingContainer = styled.div`
  border: 2px solid ${(props) => props.theme.text};
  box-sizing: border-box;
  overflow: hidden;
  width: fit-content;
`;
export const MessagingDisplayContainer = styled.div`
  width: 20rem;
  height: 25rem;
  overflow-y: auto;
  padding: 1rem 0;
  &::-webkit-scrollbar {
    width: 0px;
  }
`;

export const MessageRecieveDisplay = styled.div``;
export const RecievedMessageContainer = styled.div`
  width: 100%;
  padding: 0.3rem 1rem;
  box-sizing: border-box;
`;

export const RecievedMessageDate = styled.div`
  font-size: 0.65rem;
  color: ${(props) => props.theme.text};
  padding: 0.1rem 0.5rem;
`;
export const RecievedMessage = styled.div`
  max-width: 70%;
  width: fit-content;
  padding: 0.5rem 0.8rem;
  background: ${(props) => props.theme.grey};
  color: ${(props) => props.theme.text};
  border-radius: 1rem;
`;

export const SentMessageContainer = styled(RecievedMessageContainer)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const SentMessage = styled(RecievedMessage)`
  background: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.background};
`;

export const SentMessageDate = styled(RecievedMessageDate)``;

export const MessageInput = styled.textarea`
  outline: none;
  width: 80%;
  border: none;
  padding: 1rem;
  font-size: 1rem;
  font-family: ${(props) => props.theme.font};
  word-wrap: break-word;
  resize: none;

  &::-webkit-scrollbar {
    width: 0px;
  }

  /* Scrollbar track */
  // &::-webkit-scrollbar-track {
  //   box-shadow: inset 0 0 5px grey;
  //   border-radius: 10px;
  // }

  /* Scrollbar handle */
  // &::-webkit-scrollbar-thumb {
  //   background: red;
  //   border-radius: 10px;
  // }

  // /* Scrollbar handle on hover */
  // &::-webkit-scrollbar-thumb:hover {
  //   background: #b30000;
  // }
`;

export const MessageInputBar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  border-top: 2px solid ${(props) => props.theme.grey};
`;

export const MessageArrowContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    transform: scale(1.3);
  }
`;

export const MessageDisplayContainer = styled.div`
  display: flex;
  gap: 5rem;
`;

export const ChatboxLoading = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ChatboxHeader = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  padding: 0.5rem 0.5rem;
`;
