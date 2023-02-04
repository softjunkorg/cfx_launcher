import styled from "styled-components";

interface IMainProps {
  direction?: "row" | "column";
  isSwitch?: boolean;
}

export const Main = styled.div<IMainProps>`
  width: 100%;
  height: 100%;
  gap: ${(props) => (props.direction === "row" ? props.theme.padding : 3)}px;
  display: flex;
  flex-direction: ${(props) => props.direction};
  align-items: ${(props) =>
    props.direction === "row" || props.isSwitch === true ? "center" : ""};
  justify-content: center;
`;

export const Label = styled.span`
  font-size: 16px;
  color: ${(props) => props.theme.colorText};
  font-weight: 500;
  display: flex;
  gap: 5px;
  align-items: center;
`;

export const Help = styled.div`
  height: 20px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  background: ${(props) => props.theme.colorFillAlter};
  border-radius: 100px;
  cursor: help;
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
