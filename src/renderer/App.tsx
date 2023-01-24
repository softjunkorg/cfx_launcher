import { FC } from "react";
import { ConfigProvider, App as NativeApp } from "antd";
import { useRecoilValue } from "recoil";
import { themeData } from "./store/state";
import ThemeProvider from "./components/ThemeProvider";
import GlobalStyle from "./components/GlobalStyle";
import Content from "./components/Content";
import StoreWrapper from "./components/StoreWrapper";

const App: FC = () => {
  const theme = useRecoilValue(themeData);
  return (
    <ConfigProvider theme={{ token: theme.token, algorithm: theme.algorithm }}>
      <NativeApp>
        <ThemeProvider>
          <StoreWrapper />
          <GlobalStyle />
          <Content />
        </ThemeProvider>
      </NativeApp>
    </ConfigProvider>
  );
};

export default App;
