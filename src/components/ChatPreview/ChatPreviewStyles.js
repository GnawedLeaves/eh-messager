import styled from "styled-components";

export const ChatPreviewContainer = styled.div`
  display: flex;
  width: 355px;
  height: 96px;
  padding: 20px 17px;
  align-items: flex-start;
  gap: 12px;
  background: #d9d9d9;
  margin: 8px 0;
  border-radius: 16px;
  align-items: center;
  background: ${(props) => props.theme.innerBackground};
  border: 1px solid ${(props) => props.theme.borderGrey};
  cursor: pointer;
`;

export const ChatPreviewProfilePicContainer = styled.div`
  height: 100%;
`;

export const ChatPreviewProfilePicture = styled.img`
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 100%;
  object-fit: cover;
`;

export const ChatPreviewNameAndMessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 150px;
`;
export const ChatPreviewName = styled.div`
  color: ${(props) => props.theme.text};
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const ChatPreviewMessage = styled.div`
  color: ${(props) => props.theme.text};
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 180px;
  color: ${(props) => props.theme.grey};
`;

export const ChatPreviewCountReadTimeGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ChatPreviewMessageCount = styled.div`
  // width: 28px;
  height: 28px;
  flex-shrink: 0;
  display: flex;
  background: ${(props) => props.theme.primary};
  color: ${(props) => props.color};
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  padding: 0 10px;
  opacity: ${(props) => props.opacity};
  margin-top: 6px;
`;

export const ChatPreviewReadContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  height: 100%;
  height: 50px;
  opacity: ${(props) => props.opacity};
`;

export const ChatPreviewMessageTimeContainer = styled.div`
  color: ${(props) => props.theme.grey};
`;
