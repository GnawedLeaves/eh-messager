import styled from "styled-components";

export const SearchBarContainer = styled.div`
  background: ${(props) => props.theme.background};
  width: 100%;

  border: 1px solid ${(props) => props.theme.borderGrey};
  border-radius: 1rem;
  padding: 0.5rem;
  gap: 0.2rem;
  position: relative;
`;

export const SearchBarInput = styled.input`
  width: 100%;
  background: ${(props) => props.theme.background};
  font-size: 14px;
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

export const SearchBarHorizontalContainer = styled.div`
  display: flex;
  align-items: center;

  // padding: 0.5rem 0.5rem;
  // border-radius: 1rem;
  // border: 1px solid ${(props) => props.theme.text};
`;

export const SearchBarResultsContainer = styled.div`
  margin-top: 0.4rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  max-height: 10rem;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0.1rem;
  }
`;

export const SearchBarResult = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
  font-size: 14px;
  cursor: pointer;
  border-top: 1px solid ${(props) => props.theme.borderGrey};
  padding: 0.5rem 0.5rem;
`;

export const SearchBarResultProfilePicture = styled.img`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 100%;
  object-fit: cover;
`;
