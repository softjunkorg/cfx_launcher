import styled from "styled-components";

interface IIndicatorProps {
  color: string;
}

export const Indicator = styled.div<IIndicatorProps>`
  width: 10px;
  height: 10px;
  background: ${(props) => props.color};
  border-radius: 10px;
`;
