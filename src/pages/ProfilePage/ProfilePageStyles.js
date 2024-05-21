import styled, { css } from "styled-components";

const sizes = {
  desktop: 1024,
  tablet: 768,
  phone: 576,
};

const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label]}px) {
      ${css(...args)}
    }
  `;
  return acc;
}, {});

export const ProfilePageContainer = styled.div`
  // height: 100vh;
  min-height: 932px;
  background: ${(props) => props.theme.background};
`;
export const ProfilePageProfilePictureContainer = styled.div`
  height: 281px;
  background-image: url(${(props) => props.src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(
      0,
      0,
      0,
      0.15
    ); /* Adjust the opacity to darken the background */
    z-index: 1; /* Ensure the overlay is on top of the background image */
  }

  @media (min-width: 1024px) {
    height: 50vh;
  }
`;

export const ProfilePageProfilePictureContainerSide = styled.div`
  width: 50%;
  height: 100%;
  z-index: 1;
`;

export const ProfilePagePictureCounterAndIconGroup = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 40px;
  z-index: 10;
  background: red;
  height: fit-content;
`;

export const ProfilePagePictureCounter = styled.div`
  position: absolute;
  background: lime;
  top: 20px;
  right: ${(props) => (props.viewingOwnProfile ? "60px" : "20px")};
  display: inline-flex;
  padding: 4px 16px;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  background: ${(props) => props.theme.grey}90;
  color: ${(props) => props.theme.white};
  z-index: 10;
`;

export const ProfilePageProfilePictureIcon = styled.div`
  position: absolute;
  z-index: 10;
  right: 20px;
  top: 22px;
  z-index: 10;
`;

export const ProfilePageProfilePictureBackIcon = styled.div`
  position: absolute;
  top: 20px;
  left: 18px;
  z-index: 10;
  padding: 4px;
`;

export const ProfilePageProfilePictureButton = styled.div`
  background: ${(props) => props.theme.primary};
  width: 68px;
  height: 68px;
  flex-shrink: 0;
  position: absolute;
  border-radius: 50%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: -34px;
  right: 30px;
`;

export const ProfilePageDetailsContainer = styled.div`
  padding: 48px 42px;
  height: 100%;
`;
export const ProfilePageDetailsSubtitleAndTitleGroup = styled.div`
  margin-bottom: 20px;
`;
export const ProfilePageDetailsSubtitle = styled.div`
  color: ${(props) => props.theme.grey};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
`;
export const ProfilePageDetailsTitle = styled.div`
  width: 296px;
  color: ${(props) => props.theme.text};
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
`;

export const ProfilePageButtonContainer = styled.div`
  width: 100%;
  justify-content: center;
  display: flex;
`;

export const ProfilePageButton = styled.div`
  display: inline-flex;
  padding: 10px 22px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 24px;
  background: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.white};
  font-size: 16px;
  text-align: center;
  box-shadow: ${(props) => props.theme.boxShadow};
`;
