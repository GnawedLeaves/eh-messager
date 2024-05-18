import { ThemeProvider } from "styled-components";
import {
  SideBarContainer,
  SidebarBigContainer,
  SidebarProfileBox,
} from "./SidebarStyles";
import { lightTheme } from "../../theme";

const Sidebar = (props) => {
  return (
    <ThemeProvider theme={lightTheme}>
      {props.showSidebar ? (
        <SidebarBigContainer>
          <SideBarContainer>
            <SidebarProfileBox>Box</SidebarProfileBox>
          </SideBarContainer>
        </SidebarBigContainer>
      ) : (
        <></>
      )}
    </ThemeProvider>
  );
};

export default Sidebar;
