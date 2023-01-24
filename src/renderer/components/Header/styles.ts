import styled from "styled-components";

export const Main = styled.div`
  width: 100%;
  min-height: 35px;
  background: ${(props) => props.theme.colorBgContainerDisabled};
  display: flex;
  -webkit-app-region: drag;
  user-select: none;
  align-items: center;
  padding-left: 20px;
`;

export const Title = styled.span`
  color: ${(props) => props.theme.colorTextBase};
  font-size: 1em;
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: row;
  width: fit-content;
  height: 100%;
  -webkit-app-region: no-drag;
  aspect-ratio: 3 / 1;
  margin-left: auto;
  margin-right: 0;
`;

interface SActionProps {
  display: "close" | "default";
}

export const Action = styled.div<SActionProps>`
  height: 100%;
  width: auto;
  aspect-ratio: 1 / 1;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colorTextBase};
  cursor: pointer;
  transition: 150ms;
  font-size: 1.2em;

  &:hover {
    background: ${(props) =>
      props.display === "close"
        ? props.theme.red
        : props.theme.colorBgTextHover};
  }

  &:active {
    background: ${(props) =>
      props.display === "close"
        ? props.theme["red-5"]
        : props.theme.colorBgTextActive};
  }
`;
