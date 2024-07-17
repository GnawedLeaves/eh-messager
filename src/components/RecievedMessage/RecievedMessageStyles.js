import styled from "styled-components";

export const RecievedMessageContainer = styled.div`
  width: 100%;
  padding: 0.3rem 1rem;
  box-sizing: border-box;
  position: relative;
`;

export const RecievedMessageDate = styled.div`
  font-size: 0.65rem;
  color: ${(props) => props.theme.grey};
  padding: 0.1rem 0.5rem;
`;
export const RecievedMessageBubble = styled.div`
  max-width: 70%;
  width: fit-content;
  padding: 0.5rem 0.8rem;
  background: #ff787f;
  //background: salmon;

  color: ${(props) => props.theme.white};
  border-radius: 1rem;
`;

export const RecievedMessageMedia = styled.video`
  max-height: 50%;
  max-width: 100%;
  border: 1px solid ${(props) => props.theme.grey};
  border-radius: 8px;
  cursor: pointer;
`;

export const RecievedMessageReplyContainer = styled.div`
  background: #ff8b91;
  padding: 8px 8px;
  border-radius: 8px;
  margin: 4px 0;
  width: 100%;
  border-left: 2px solid ${(props) => props.theme.white};
`;
export const RecievedMessageReplyUsername = styled.div`
  font-weight: bold;
`;
