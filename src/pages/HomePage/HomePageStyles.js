import styled from "styled-components";

export const ChatPreviewsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const HomePageContainer = styled.div`
  width: 100%;
  background: ${(props) => props.theme.background};
  min-height: 100vh;
  position: relative;
`;
