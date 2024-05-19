import styled from "styled-components";

export const MessagingContainer = styled.div`
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
  min-height: 100vh;
  background: ${(props) => props.theme.background};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
`;
export const MessagingDisplayContainer = styled.div`
  width: 100%;
  height: 70%;
  overflow-y: auto;
  padding: 1rem 0;
  padding: 64px 0 52px 0;
  &::-webkit-scrollbar {
    width: 0px;
  }
`;

export const MessageRecieveDisplay = styled.div``;
export const RecievedMessageContainer = styled.div`
  width: 100%;
  padding: 0.3rem 1rem;
  box-sizing: border-box;
  position: relative;
`;

export const RecievedMessageDate = styled.div`
  font-size: 0.65rem;
  color: ${(props) => props.theme.text};
  padding: 0.1rem 0.5rem;
`;
export const RecievedMessageBubble = styled.div`
  max-width: 70%;
  width: fit-content;
  padding: 0.5rem 0.8rem;
  background: ${(props) => props.theme.grey};
  color: ${(props) => props.theme.white};
  border-radius: 1rem;
`;

export const SentMessageContainer = styled(RecievedMessageContainer)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const SentMessageBubble = styled(RecievedMessageBubble)`
  background: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.background};
`;

export const SentMessageDate = styled(RecievedMessageDate)``;

export const MessageInput = styled.textarea`
  outline: none;
  width: 100%;
  border: none;
  padding: 16px 16px;
  font-size: 1rem;
  font-family: "Inter", sans-serif;
  word-wrap: break-word;
  resize: none;

  background: ${(props) => props.theme.innerBackground};
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
  background: ${(props) => props.theme.innerBackground};
  border-bottom: 1px solid ${(props) => props.theme.borderGrey};
  position: relative;
  justify-content: space-between;
  position: fixed;
  width: 100%;
  z-index: 1;
  bottom: 0;
`;

export const MessageArrowContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    transform: scale(1.3);
  }
  background: ${(props) => props.theme.innerBackground};
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
  background: ${(props) => props.theme.innerBackground};
  border-bottom: 1px solid ${(props) => props.theme.borderGrey};
  position: fixed;
  width: 100%;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  height: 64px;
`;

export const ChatboxHeaderProfilePicture = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: red;
`;

export const MessagingContainerBig = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border: none;
  overflow: hidden;
  display: grid;
  grid-template-rows: 0.1fr 1fr 0.08fr;
`;

export const MessagingDisplayContainerBig = styled.div`
  overflow-y: auto;
  padding: 1rem 0;
  width: 100%;
  grid-row: 2;
  &::-webkit-scrollbar {
    width: 0px;
  }
`;

export const MessageInputBarBig = styled(MessageInputBar)`
  height: 100%;
  grid-row: 3;

  z-index: 11;
  position: relative;
`;

export const ChatboxHeaderBig = styled(ChatboxHeader)`
  padding: 0.8rem 0.8rem;
  font-size: 1.5rem;
  font-weight: bold;
  background: ${(props) => props.theme.background};
`;

export const MessageInputBig = styled(MessageInput)`
  width: 100%;
  padding: 0.8rem 1rem;
  background: ${(props) => props.theme.innerBackground};
  font-size: 1.1rem;
  grid-column: 1;
  z-index: 11;
  border-top: 1px solid ${(props) => props.theme.borderGrey};
`;

export const MessageArrowContainerBig = styled.div`
  grid-column: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 0.5rem;
  width: fit-content;
  padding-right: 0.5rem;
  z-index: 11;

  height: 100%;
`;

export const MessageArrowContainerSmall = styled.div`
  transition: 0.3s;
  &:hover {
    transform: scale(1.2);
  }
`;

export const MessageAttachmentPreview = styled.div`
  position: absolute;
  width: 100%;
  top: ${(props) => props.transformValue};
  z-index: 10;
  transition: 0.3s;
  // border-top: 1px solid ${(props) => props.theme.borderGrey};
  background: ${(props) => props.theme.background};
  padding: 0.6rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
`;

export const MessageAttachmentPreviewIcon = styled.div`
  cursor: pointer;
`;

export const RecievedMessageOptionsModal = styled.div`
  position: absolute;
  top: -2rem;
  left: 50%;
  display: flex;
  flex-direction: column;
  opacity: ${(props) => (props.display ? 1 : 0)};
  transition: 0.3s;
  background: salmon;
  z-index: 99;
  padding: 1rem;
`;

export const SentMessageOptionsModal = styled.div`
  position: absolute;
  top: -2rem;
  right: 50%;
  display: flex;
  flex-direction: column;
  opacity: ${(props) => (props.display ? 1 : 0)};
  transition: 0.3s;
  background: salmon;
  z-index: 99;
  padding: 1rem;
`;
