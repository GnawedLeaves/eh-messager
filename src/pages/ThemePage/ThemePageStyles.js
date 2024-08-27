import styled from "styled-components";

export const ThemePageContainer = styled.div`
  width: 100%;
  background: ${(props) => props.theme.background};
  min-height: 100vh;
  position: relative;
`;

export const ThemePageTopBar = styled.div`
  width: 100%;
  padding: 21px 23px;
  box-sizing: border-box;
  // background: red;
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

export const PublicThemesContainer = styled.div`
  background: red;
  width: 100%;
  display: flex;
`;
