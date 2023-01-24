import styled from "styled-components";
import { Collapse, Space } from "antd";

export const Panel = styled(Collapse.Panel)`
  margin-bottom: 10px;
  background: ${(props) => props.theme.colorFillAlter};
  border-radius: 2.5px;
  border: none !important;

  &:nth-last-child(1) {
    margin-bottom: 0;
  }
`;

export const FullSpace = styled(Space)`
  width: 100%;
`;
