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
  margin-bottom: 2rem;
  height: 20rem;
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

export const PublicThemeContainerTitle = styled.div`
  font-size: 1.5rem;
`;

export const PublicThemeBigContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
`;
export const PublicThemeContainer = styled.div`
  width: 160px;
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

export const OwnedThemeButton = styled.div`
  padding: 0.7rem;
  border-radius: 100%;
  border: 1px solid
    ${(props) => (props.selected ? props.selectedColor : props.theme.text)};
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const OwnedThemeButtonsContainer = styled.div`
  display: flex;
  gap: 0.8rem;
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
  align-items: flex-start;
`;

export const ThemesTopBar = styled.div`
  display: flex;
  width: 100%;
  padding: 0 1rem;
  justify-content: space-between;
  align-items: center;
`;
export const AddNewThemeButton = styled.button`
  border: 1px solid ${(props) => props.background};
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 1rem;
  background: ${(props) => props.background};
  color: ${(props) => props.color};
`;

export const AddNewThemeContainer = styled.div``;

export const MessagePreviewPrimary = styled.div`
  width: 40%;
  height: 50px;
  border-radius: 1rem;
  transition: 0.3s;
  background: ${(props) => props.background};
  color: ${(props) => props.color};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MessagePreviewPrimaryContainer = styled.div`
  margin-top: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const HightLightContainer = styled.div`
  padding: ${(props) => (props.highlighted ? "0.2rem" : " 0.3rem 1rem")};
  margin-left: ${(props) => (props.highlighted ? "0.8rem" : "")};
  border-radius: 1.2rem;
  border: ${(props) =>
    props.highlighted ? `2px solid ${props.borderColor}` : "transparent"};
  display: inline-flex;
  width: ${(props) => (props.highlighted ? "fit-content" : "100%")};
  transition: 0.3s;
  margin-bottom: ${(props) => (props.highlighted ? "0.5rem" : "0")};
  flex-direction: column;
`;
