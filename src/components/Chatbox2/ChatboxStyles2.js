import styled from "styled-components";

export const AdminMessagingContainer = styled.div`
  border: 2px solid ${(props) => props.theme.text};
  box-sizing: border-box;
  overflow: hidden;
  width: fit-content;
`;
export const AdminMessagingDisplayContainer = styled.div`
  width: 20rem;
  height: 25rem;
  overflow-y: auto;
  padding: 1rem 0;
  &::-webkit-scrollbar {
    width: 0px;
  }
`;

export const AdminMessageRecieveDisplay = styled.div``;
export const AdminRecievedMessageContainer = styled.div`
  width: 100%;
  padding: 0.3rem 1rem;
  box-sizing: border-box;
`;

export const AdminAdminRecievedMessageDate = styled.div`
  font-size: 0.65rem;
  color: ${(props) => props.theme.text};
  padding: 0.1rem 0.5rem;
`;
export const AdminRecievedMessage = styled.div`
  max-width: 70%;
  width: fit-content;
  padding: 0.5rem 0.8rem;
  background: ${(props) => props.theme.grey};
  color: ${(props) => props.theme.text};
  border-radius: 1rem;
`;

export const AdminSentMessageContainer = styled(AdminRecievedMessageContainer)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const AdminSentMessage = styled(AdminRecievedMessage)`
  background: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.background};
`;

export const AdminAdminSentMessageDate = styled(
  AdminAdminRecievedMessageDate
)``;

export const AdminMessageInput = styled.textarea`
  outline: none;
  width: 80%;
  border: none;
  padding: 1rem;
  font-size: 1rem;
  font-family: "Inter", sans-serif;
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

export const AdminMessageInputBar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  border-top: 2px solid ${(props) => props.theme.grey};
  position: relative;
`;

export const AdminMessageArrowContainer = styled.div`
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

export const AdminMessagingContainerBig = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border: none;
  overflow: hidden;
  display: grid;
  grid-template-rows: 0.1fr 1fr 0.08fr;
`;

export const AdminMessagingDisplayContainerBig = styled.div`
  overflow-y: auto;
  padding: 1rem 0;
  width: 100%;
  grid-row: 2;
  &::-webkit-scrollbar {
    width: 0px;
  }
`;

export const AdminMessageInputBarBig = styled(AdminMessageInputBar)`
  height: 100%;
  grid-row: 3;
  background: ${(props) => props.theme.background};
  z-index: 11;
  position: relative;
`;

export const ChatboxHeaderBig = styled(ChatboxHeader)`
  padding: 0.8rem 0.8rem;
  font-size: 1.5rem;
  font-weight: bold;
  background: ${(props) => props.theme.background};
`;

export const AdminMessageInputBig = styled(AdminMessageInput)`
  width: 100%;
  padding: 0.8rem 1rem;
  background: ${(props) => props.theme.background};
  font-size: 1.1rem;
  grid-column: 1;
  z-index: 11;
`;

export const AdminMessageArrowContainerBig = styled.div`
  grid-column: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 0.5rem;
  width: fit-content;
  padding-right: 0.5rem;
  z-index: 11;
  background: ${(props) => props.theme.background};
  height: 100%;
`;

export const AdminMessageArrowContainerSmall = styled.div`
  transition: 0.3s;
  &:hover {
    transform: scale(1.2);
  }
`;

export const AdminMessageAttachmentPreview = styled.div`
  position: absolute;
  width: 100%;
  top: ${(props) => props.transformValue};
  z-index: 10;
  transition: 0.3s;
  border-top: 1px solid ${(props) => props.theme.grey};
  background: ${(props) => props.theme.background};
  padding: 0.6rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
`;

export const AdminMessageAttachmentPreviewIcon = styled.div`
  cursor: pointer;
`;
