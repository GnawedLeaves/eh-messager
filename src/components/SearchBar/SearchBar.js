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
import { useNavigate } from "react-router-dom";
const SearchBar = (props) => {
  const navigate = useNavigate();
  const [searchBarInput, setSearchBarInput] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const searchInput = async () => {
    const lowercasedInput = searchBarInput.toLowerCase();

    // Filter users based on the search input
    const results = allUsers.filter((user) =>
      user.username.toLowerCase().includes(lowercasedInput)
    );

    setSearchResults(results);
  };

  useEffect(() => {
    if (searchBarInput !== "") {
      searchInput();
    } else {
      clearSearchBarInput();
    }
  }, [searchBarInput]);

  useEffect(() => {
    console.log(props.allUsers);
    if (props.allUsers) {
      setAllUsers(props.allUsers);
    }
  }, [props.allUsers]);

  const handleResultClick = (otherPersonId) => {
    navigate(`/chat/${otherPersonId}`);
  };

  const clearSearchBarInput = () => {
    setSearchBarInput("");
    setSearchResults([]);
  };

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
              console.log(e.target.value);
            }}
          />
          {searchBarInput !== "" ? (
            <RxCross2
              onClick={() => {
                clearSearchBarInput();
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
                <SearchBarResult
                  key={index}
                  onClick={() => {
                    handleResultClick(result.userId);
                  }}
                >
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
