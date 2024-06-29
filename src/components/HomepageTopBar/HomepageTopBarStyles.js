import styled from "styled-components";

export const HomePageTopBarContainer = styled.div`
  width: 100%;
  padding: 21px 23px;
  height: 56px;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  gap: 18px;

  color: ${(props) => props.theme.text};
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
