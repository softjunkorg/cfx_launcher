import { createGlobalStyle } from "styled-components";

export const Main = createGlobalStyle`
  body, html, #root {
    margin: 0;
    width: 100vw;
    height: 100vh;
    background: ${(props) => props.theme.colorBgContainer};
  }

  * {
    box-sizing: border-box;
    font-family: ${(props) => props.theme.fontFamily}
  }

  // Custom Scrollbar
  ::-webkit-scrollbar {
    width: 3px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colorBgTextHover};
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.colorBgTextActive};
  }

  // Fix Antd Tabs
  .ant-layout-sider-children,
  .ant-tabs,
  .ant-tabs-content,
  .ant-tabs-tabpane,
  .tab-panel {
    width: 100%;
    display: flex;
    flex-flow: column;
    height: 100%;
    user-select: none;
  }

  .ant-tabs-content-holder {
    height: 100%;
    overflow-y: scroll;
  }

  .ant-tabs-tabpane {
    height: 100%;
  }

  .ant-tabs-tabpane {
    flex-shrink: 1 !important;
  }

  // Fix Antd App
  .ant-app {
    width: 100%;
    height: 100%;
  }

  // Fix Antd Message
  .ant-message {
    top: initial !important;
    left: initial !important;
    transform: initial !important;
    bottom: 8px;
    right: 8px;
    width: fit-content;
  }

  // Fix Antd Upload
  .ant-upload {
    padding: 0 !important;
  }
`;
