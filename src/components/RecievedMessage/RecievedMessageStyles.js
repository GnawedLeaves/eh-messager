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
  max-width: ${(props) => (props.highlighted ? "" : "70%")};
  width: fit-content;
  padding: 0.5rem 0.8rem;
  background: ${(props) =>
    props.themePageBackground
      ? props.themePageBackground
      : props.theme.recievedBubbleColor};
  color: ${(props) =>
    props.themePageColor
      ? props.themePageColor
      : props.theme.recievedTextColor};
  border-radius: 1rem;
  transition: 0.3s;
  word-break: break-word;
  hyphens: auto;
`;

export const RecievedMessageMedia = styled.video`
  max-height: 50%;
  max-width: 100%;
  border: 1px solid ${(props) => props.theme.grey};
  border-radius: 8px;
  cursor: pointer;
`;

export const RecievedMessageReplyContainer = styled.div`
  background: ${(props) => props.theme.recievedBubbleColor};
  color: ${(props) => props.theme.recievedTextColor};
  padding: 8px 8px;
  border-radius: 8px;
  margin: 4px 0;
  width: 100%;
  border-left: 2px solid ${(props) => props.theme.recievedTextColor};
  border: 2px solid ${(props) => props.theme.recievedTextColor};
`;
export const RecievedMessageReplyUsername = styled.div`
  font-weight: bold;
`;
