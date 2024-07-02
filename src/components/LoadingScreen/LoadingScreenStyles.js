import styled from "styled-components";

export const LoadingScreenContainer = styled.div`
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  position: absolute;
  z-index: 999999999;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;
