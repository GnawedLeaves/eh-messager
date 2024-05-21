import styled from "styled-components";

export const MessageModalBlocker = styled.div`
  color: ${(props) => props.theme.text};
  // display: ${(props) => (props.show ? "flex" : "none")};
  display: flex;
  width: 100%;
  background: black;
  opacity: 0.05;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 999;
  height: 100vh;
  align-items: center;
  justify-content: center;
  // transition: 0.3s;
  // transition-delay: 0.5s;
  transform: scale(${(props) => (props.show ? "1" : "0")});
`;

export const MessageModalContainer = styled.div`
  background: green;
  // display: ${(props) => (props.show ? "flex" : "none")};
  position: absolute;
  top: ${(props) => props.messageModalY + "px"};
  left: ${(props) => props.messageModalX + "px"};
  z-index: 9999;
  flex-direction: column;
  padding: 24px 24px;
  border-radius: 16px;
  transition: 0.2s;
  transform-origin: top left;
  transform: scale(${(props) => (props.show ? "1" : "0")});
  display: flex;
  gap: 16px;
  background: ${(props) => props.theme.innerBackground};
`;

export const MessageModalOption = styled.div`
  font-size: 16px;
  color: ${(props) => props.theme.text};
`;
