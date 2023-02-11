import "@fontsource/inconsolata/600.css";
import "@fontsource/unbounded/300.css";
import i18next from "i18next";
import { FC, useEffect } from "react";
import { useRecoilState } from "recoil";
import Header from "renderer/components/Header";
import Tabs from "renderer/components/Tabs";
import { useStoreActions } from "renderer/store/actions";
import { themeData } from "renderer/store/state";
import { ContentPanel, Main } from "./styles";

const Content: FC = () => {
  const { store } = useStoreActions();
  const [theme, setTheme] = useRecoilState(themeData);

  useEffect(() => {
    /* Listen to language changes */
    if (store.settings && store.settings.language !== i18next.language) {
      i18next.changeLanguage(store.settings.language);
    }

    /* Listening to theme changes */
    if (store.settings.themeColor) {
      if (theme.token?.colorPrimary !== store.settings.themeColor) {
        setTheme((th) => ({
          ...th,
          token: {
            ...th.token,
            colorPrimary: store.settings.themeColor as unknown as string,
          },
        }));
      }
    }
  }, [store]);

  return (
    <Main>
      <Header />
      <ContentPanel>
        <Tabs />
      </ContentPanel>
    </Main>
  );
};

export default Content;
