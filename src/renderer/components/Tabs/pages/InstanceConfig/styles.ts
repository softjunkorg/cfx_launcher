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

export const UploadContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

export const UploadImage = styled.img`
  width: 100%;
  height: fit-content;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
`;
