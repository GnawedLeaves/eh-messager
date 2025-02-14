import styled from "styled-components";

export const ModalContainer = styled.dialog`
  border-radius: 1rem;
  max-width: 80%;
  min-height: 9rem;
  border: none;
  display: ${(props) => (props.display ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  text-align: center;
  border: 1px solid ${(props) => props.theme.borderGrey};
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
`;

export const ModalTitle = styled.div`
  font-size: 1.6rem;
  font-weight: bold;
`;
export const ModalContent = styled.div`
  width: 90%;
  text-align: center;
`;

export const ModalButtonContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

export const EmptyModalContainer = styled.dialog`
  display: ${(props) => (props.display ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  border: none;
  width: 80%;
  padding: 2rem;
  border: 1px solid ${(props) => props.theme.borderGrey};
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
`;
export const EmptyModalCloseContainer = styled.div`
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  display: ${(props) => (props.display ? "flex" : "none")};
`;
