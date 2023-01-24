import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Flag = styled.div`
  height: fit-content;
  min-width: 20px;
  max-width: 20px;
  display: flex;
  align-items: center;
  border-radius: 2.5px;
  overflow: hidden;

  & img {
    width: 100%;
  }
`;

export const Text = styled.div`
  flex: auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
