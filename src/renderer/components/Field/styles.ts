import styled from "styled-components";

interface IMainProps {
  direction?: "row" | "column";
}

export const Main = styled.div<IMainProps>`
  width: 100%;
  height: fit-content;
  gap: ${(props) => (props.direction === "row" ? props.theme.padding : 3)}px;
  display: flex;
  flex-direction: ${(props) => props.direction};
  align-items: ${(props) => (props.direction === "row" ? "center" : "")};
`;

export const Label = styled.span`
  font-size: 16px;
  color: ${(props) => props.theme.colorText};
  font-weight: 500;
`;

export const Fields = styled.div`
  width: 100%;
  height: fit-content;
  padding: ${(props) => props.theme.padding}px;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.padding}px;
  background: ${(props) => props.theme.colorFillAlter};
  border-radius: ${(props) => props.theme.borderRadius}px;
`;
