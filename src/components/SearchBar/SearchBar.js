import { ThemeProvider } from "styled-components";
import {
  SearchBarContainer,
  SearchBarHorizontalContainer,
  SearchBarIconContainer,
  SearchBarInput,
  SearchBarResult,
  SearchBarResultProfilePicture,
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
    {
      username: "tester9",
      profilePicture:
        "https://staticg.sportskeeda.com/editor/2023/03/9d325-16790993553785-1920.jpg",
      userId: "21h3j12h3",
    },
    {
      username: "tester9",
      profilePicture:
        "https://staticg.sportskeeda.com/editor/2023/03/9d325-16790993553785-1920.jpg",
      userId: "21h3j12h3",
    },
    {
      username: "tester9",
      profilePicture:
        "https://staticg.sportskeeda.com/editor/2023/03/9d325-16790993553785-1920.jpg",
      userId: "21h3j12h3",
    },
    {
      username: "tester9",
      profilePicture:
        "https://staticg.sportskeeda.com/editor/2023/03/9d325-16790993553785-1920.jpg",
      userId: "21h3j12h3",
    },
    {
      username: "tester9",
      profilePicture:
        "https://staticg.sportskeeda.com/editor/2023/03/9d325-16790993553785-1920.jpg",
      userId: "21h3j12h3",
    },
    {
      username: "tester9",
      profilePicture:
        "https://staticg.sportskeeda.com/editor/2023/03/9d325-16790993553785-1920.jpg",
      userId: "21h3j12h3",
    },
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
        <SearchBarHorizontalContainer>
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
                setSearchResults([]);
              }}
            />
          ) : (
            <></>
          )}
        </SearchBarHorizontalContainer>

        {searchResults.length > 0 ? (
          <SearchBarResultsContainer>
            {searchResults.map((result, index) => {
              return (
                <SearchBarResult key={index}>
                  <SearchBarResultProfilePicture src={result.profilePicture} />

                  {result.username}
                </SearchBarResult>
              );
            })}
          </SearchBarResultsContainer>
        ) : (
          <></>
        )}
      </SearchBarContainer>
    </ThemeProvider>
  );
};

export default SearchBar;
