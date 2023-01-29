import styled, { css } from "styled-components";

export const Main = styled.div`
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.colorFillAlter};
  border-radius: ${(props) => props.theme.borderRadius};
  display: flex;
  padding: 10px;
  flex-direction: column;
  gap: 10px;
  overflow: auto;
  position: relative;
  overflow: hidden;
`;

interface IMessagesProps {
  scroll: boolean;
}

export const Messages = styled.div<IMessagesProps>`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 5px;
  overflow-y: ${(props) => (props.scroll ? "scroll" : "hidden")};
  white-space: pre-wrap;
  position: relative;

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
`;

export const Messenger = styled.div`
  width: 100%;
  min-height: 40px;
  background: ${(props) => props.theme.colorFillAlter};
  border-radius: ${(props) => props.theme.borderRadius};
  display: flex;
  align-items: center;
  padding: 7.5px;
`;

export const Widget = styled.div`
  width: 100%;
  height: fit-content;
  padding: ${(props) => props.theme.paddingSM}px;
  background: ${(props) => props.theme.colorFillAlter};
  border-radius: 5px;
  display: flex;
  align-items: center;
  margin: 5px 0;
  position: relative;
`;

interface IWidgetIconProps {
  type: "success" | "error" | "warning" | "info";
}

export const WidgetIcon = styled.div<IWidgetIconProps>`
  width: fit-content;
  height: fit-content;
  position: absolute;
  left: ${(props) => props.theme.padding}px;
  font-size: ${(props) => props.theme.fontSizeLG}px;

  & .anticon {
    ${(props) => {
      switch (props.type) {
        case "success":
          return css`
            color: ${props.theme.colorSuccess};
          `;

        case "error":
          return css`
            color: ${props.theme.colorError};
          `;

        case "warning":
          return css`
            color: ${props.theme.colorWarning};
          `;

        case "info":
          return css`
            color: ${props.theme.colorInfo};
          `;

        default:
          return ``;
      }
    }}
  }
`;

export const WidgetContent = styled.div`
  width: fit-content;
  height: fit-content;
  margin: 0 auto;
`;

export const MessengerIcon = styled.div`
  min-width: 25px;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
`;
