import styled from "styled-components";

export const SidebarBigContainer = styled.div`
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  position: absolute;
  display: flex;
`;

export const SidebarBlocker = styled.div`
  background: rgba(0, 0, 0, 0.4);
  // background: salmon;
  width: 100%;
`;

export const SideBarContainer = styled.div`
  width: 339px;
  height: 100%;
  flex-shrink: 0;
  background: ${(props) => props.theme.background};
`;

export const SidebarProfileBox = styled.div`
  width: 339px;
  height: 144px;
  flex-shrink: 0;
  background: ${(props) => props.theme.primary};
  padding: 16px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const SidebarProfilePicture = styled.img`
  width: 74px;
  height: 74px;
  flex-shrink: 0;
  border-radius: 50%;
  border: none;
  object-fit: cover;
  cursor: pointer;
`;

export const SidebarUsername = styled.div`
  color: ${(props) => props.theme.white};
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const SidebarOptionsContainer = styled.div``;
export const SidebarOption = styled.div`
  height: 60px;
  font-size: 16px;
  color: ${(props) => props.theme.text};
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 16px 32px;
  cursor: pointer;
`;

export const SidebarThemeModeContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 24px;
`;
