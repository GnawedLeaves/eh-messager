import styled from "styled-components";

export const HomePageTopBarContainer = styled.div`
  width: 100%;
  padding: 21px 23px;
  box-sizing: border-box;

  color: ${(props) => props.theme.text};
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  // background: red;
`;

export const HomePageTopBarHamburgerAndTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 1rem;
`;
