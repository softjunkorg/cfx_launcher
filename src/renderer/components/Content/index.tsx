import Header from "renderer/components/Header";
import Tabs from "renderer/components/Tabs";
import { useStoreActions } from "renderer/store/actions";
import "@fontsource/inconsolata/600.css";
import i18next from "i18next";
import { FC, useEffect } from "react";
import { ContentPanel, Main } from "./styles";
import "renderer/assets/fonts/index.css";

const Content: FC = () => {
  const { store } = useStoreActions();

  // Listen to language changes
  useEffect(() => {
    if (store.settings && store.settings.language !== i18next.language) {
      i18next.changeLanguage(store.settings.language);
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
