import styled from "styled-components";

export const SearchBarContainer = styled.div`
  background: ${(props) => props.theme.background};
  width: 100%;
  display: flex;
  align-items: center;
  border: 1px solid ${(props) => props.theme.text};
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  gap: 0.2rem;
  position: relative;
`;

export const SearchBarInput = styled.input`
  width: 100%;
  background: ${(props) => props.theme.background};
  font-size: 16px;
  border: none;
  padding: 0.1rem 0.5rem;
  color: ${(props) => props.theme.text};
  font-family: "Inter", sans-serif;

  &:focus {
    outline: none;
    // color: blue;
    // border: 1px solid black;
    // text-decoration: underline;
    // box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.5);
    // border-radius: 0.5rem;
  }
`;

export const SearchBarIconContainer = styled.div`
  cursor: pointer;
`;

export const SearchBarResultsContainer = styled.div`
  //change this to make it appear below the search bar just like github
  width: 100%;
  position: absolute;
  height: 10rem;
  background: red;
  bottom: -10rem;
  left: 0;
`;
