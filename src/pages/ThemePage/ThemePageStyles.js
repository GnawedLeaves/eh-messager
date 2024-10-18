import styled from "styled-components";

export const ThemePageContainer = styled.div`
  width: 100%;
  background: ${(props) => props.theme.background};
  min-height: 100vh;
  position: relative;
  color: ${(props) => props.theme.text};
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
  background: ${(props) => props.background};
  border: 2px solid ${(props) => props.theme.lightGrey};
  border-left: none;
  border-right: none;
  transition: 0.3s;
`;

export const MessagePreviewContainer = styled.div`
  position: relative;
`;

export const MessagePreviewModeContainer = styled.div`
  position: absolute;
  top: 0;
  right: 2rem;
  z-index: 9;
`;

export const ThemePageSentMessageBubble = styled.div``;

export const ThemePageRecentColoursContainer = styled.div`
  width: 100%;
`;

export const PublicThemesContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 1rem 30px;
  align-items: center;
  justify-content: center;
`;

export const PublicThemeContainerTitle = styled.div``;

export const PublicThemeContainer = styled.div`
  width: 180px;
  height: 200px;
  border: 2px solid
    ${(props) => (props.selected ? props.selectedColor : props.theme.lightGrey)};
  border-radius: 1rem;
  padding: 1rem 0.5rem;
  overflow: hidden;
  transition: 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const PublicThemePreviewContainer = styled.div`
  width: 100%;
  height: 80%;
  position: relative;
`;
export const PublicThemePreviewRecieved = styled.div`
  width: 100px;
  height: 30px;
  border-radius: 1rem;
  background: ${(props) => props.background};
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const PublicThemePreviewSent = styled(PublicThemePreviewRecieved)`
  left: unset;
  right: 0;
  top: 40px;
`;

export const PublicThemePreviewText = styled.div`
  width: 60%;
  height: 5px;
  border-radius: 1rem;
  background: ${(props) => props.background};
`;

export const PublicThemeName = styled.span`
  text-align: center;
  font-size: 1.2rem;
`;
export const PublicThemeCreatorUsername = styled.span`
  text-align: center;
  color: ${(props) => props.theme.lightGrey};
`;

export const ThemeCarousellContainer = styled.div`
  width: 100%;
  padding: 1rem 2rem;
`;

export const ThemeCarousellViewingBox = styled.div`
  overflow: auto;
  width: 100%;
  position: relative;
  padding-bottom: 4rem;
`;

export const ThemeCarousell = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  gap: 1rem;
`;
