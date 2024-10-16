import styled from "styled-components";

export const ThemePageContainer = styled.div`
  width: 100%;
  background: ${(props) => props.theme.background};
  min-height: 100vh;
  position: relative;
  color: white;
`;

export const ThemePageTopBar = styled.div`
  width: 100%;
  padding: 21px 23px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 18px;
  color: ${(props) => props.theme.text};
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const ColourWheelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const ColourWheelHexInput = styled.input`
  padding: 0.2rem;
`;

export const ThemePreviewContainer = styled.div`
  width: 100%;
  padding: 1.2rem 0.2rem;
  background: #292929;
`;

export const MessagePreviewContainer = styled.div``;

export const ThemePageSentMessageBubble = styled.div``;

export const ThemePageRecentColoursContainer = styled.div`
  width: 100%;
`;

export const PublicThemesContainer = styled.div`
  border: 1px solid red;
  width: 100%;
  display: flex;
  padding: 1rem 30px;
`;

export const PublicThemeContainerTitle = styled.div``;

export const PublicThemeContainer = styled.div`
  width: 50px;
  height: 100px;
  border: 1px solid ${(props) => props.theme.innerBackground};
  border-radius: 1rem;
`;

export const PublicThemeName = styled.div``;
