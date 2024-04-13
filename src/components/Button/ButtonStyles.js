import styled from "styled-components";

export const ButtonContainer = styled.div`
  padding: 0.5rem 1.5rem;
  border-radius: 10rem;
  text-align: center;
  border: 2px solid
    ${(props) => (props.filled ? props.filledColor : props.defaultColor)};
  color: ${(props) =>
    props.filled ? props.theme.background : props.defaultColor};
  background: ${(props) =>
    props.filled ? props.filledColor : props.theme.background};
  transition: 0.3s;
  cursor: pointer;
  height: fit-content;
  width: fit-content;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${(props) =>
      props.filled ? props.theme.background : props.filledColor};
    color: ${(props) =>
      props.filled ? props.defaultColor : props.theme.background};
    border-color: ${(props) =>
      props.filled ? props.defaultColor : props.filledColor};
  }

  @media screen and (max-width: 1000px) {
    font-size: 0.8rem;
  }
`;
