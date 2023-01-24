import styled from "styled-components";

interface IMainProps {
  direction?: "column" | "row";
}

export const Main = styled.div<IMainProps>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: ${(props) => props.direction || "column"};
  gap: 20px;
`;
