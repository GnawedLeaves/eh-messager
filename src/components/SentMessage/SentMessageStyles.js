import styled from "styled-components";

export const SentMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
  padding: 0.3rem 1rem;
  box-sizing: border-box;
  position: relative;
`;

export const SentMessageBubble = styled.div`
  max-width: 70%;
  width: fit-content;
  padding: 0.5rem 12px;
  border-radius: 1rem;
  background: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.white};
  box-sizing: border-box;
`;

export const SentMessageTickContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

export const SentMessageDate = styled.div`
  font-size: 0.65rem;
  color: ${(props) => props.theme.grey};
  padding: 0.1rem 0.5rem;
`;

export const SentMessageMedia = styled.video`
  max-height: 50%;
  max-width: 90%;
  border: 1px solid ${(props) => props.theme.primary};
  border-radius: 5px;
  cursor: pointer;
`;

export const SentMessageReplyContainer = styled.div`
  background: ${(props) => props.theme.primaryLight};
  padding: 8px 8px;
  border-radius: 8px;
  margin: 4px 0;
  width: 100%;
  border-left: 2px solid ${(props) => props.theme.white};
`;
export const SentMessageReplyUsername = styled.div`
  font-weight: bold;
`;

export const SentMessageBodyAndTick = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  word-wrap: wrap;
  overflow-wrap: break-word;
  justify-content: space-between;
`;
