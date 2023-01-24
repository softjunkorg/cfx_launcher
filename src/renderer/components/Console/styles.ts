import styled from "styled-components";

export const Main = styled.div`
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.colorFillAlter};
  border-radius: 5px;
  display: flex;
  padding: 10px;
  flex-direction: column;
  gap: 10px;
  overflow: auto;
  position: relative;
  overflow: hidden;
`;

export const Messages = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 5px;
  overflow-y: scroll;
  white-space: pre-wrap;

  & code span {
    font-size: 16px;
    font-family: "Inconsolata", monospace;
  }
`;

export const StoppedMessage = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.1);
`;

export const Messenger = styled.div`
  width: 100%;
  min-height: 40px;
  background: ${(props) => props.theme.colorFillAlter};
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: 7.5px;
`;

export const MessengerIcon = styled.div`
  min-width: 25px;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
`;
