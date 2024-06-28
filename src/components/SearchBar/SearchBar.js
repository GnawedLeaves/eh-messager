import { ThemeProvider } from "styled-components";
import {
  SearchBarContainer,
  SearchBarIconContainer,
  SearchBarInput,
  SearchBarResultsContainer,
} from "./SearchBarStyles";
import { darktheme, lightTheme } from "../../theme";
import { IoSearch } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import { useEffect } from "react";
const SearchBar = (props) => {
  const [searchBarInput, setSearchBarInput] = useState("");
  const [searchResults, setSearchResults] = useState([
    { username: "hehe", profilePicture: "profile picture" },
  ]);

  const searchInput = async () => {};

  useEffect(() => {
    if (searchBarInput !== "") {
      searchInput();
    }
  }, [searchBarInput]);

  return (
    <ThemeProvider theme={props.themeMode === "light" ? lightTheme : darktheme}>
      <SearchBarContainer>
        <IoSearch />
        <SearchBarInput
          placeholder="Search friends..."
          value={searchBarInput}
          onChange={(e) => {
            setSearchBarInput(e.target.value);
          }}
        />
        {searchBarInput !== "" ? (
          <RxCross2
            onClick={() => {
              setSearchBarInput("");
            }}
          />
        ) : (
          <></>
        )}
        {searchResults.length > 0 ? (
          <SearchBarResultsContainer>hi</SearchBarResultsContainer>
        ) : (
          <></>
        )}
      </SearchBarContainer>
    </ThemeProvider>
  );
};

export default SearchBar;
