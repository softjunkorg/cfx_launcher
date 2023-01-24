import styled from "styled-components";

export const Main = styled.div`
  width: 100%;
  height: fit-content;
  gap: 3px;
  display: flex;
  flex-direction: column;
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
