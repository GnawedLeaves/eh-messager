import styled from "styled-components";

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
  background: salmon;
  color: ${(props) => props.theme.white};
  border-radius: 1rem;
`;
