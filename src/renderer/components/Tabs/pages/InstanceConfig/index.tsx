import { FC, useEffect, useState } from "react";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { useStoreActions } from "renderer/store/actions";
import { InstanceEvents } from "types";
import { events } from "renderer/services";
import { isEqual } from "lodash";
import { Main } from "../sharedStyles";
import PanelConfig, { defaultConfiguration } from "./panels";

const Action: FC = () => {
  const { t } = useTranslation();
  const { changeStore } = useStoreActions();
  const [disabled, setDisabled] = useState<boolean>(true);
  const [replicated, setReplicated] = useState(null);

  // Handling the save
  const handleSave = () => {
    changeStore({ instanceConfig: replicated });
  };

  // Listen to settings updates
  useEffect(() => {
    events.on(InstanceEvents.SAVE_DATA, (shared: any, data: any) => {
      if (shared !== undefined) {
        setDisabled(isEqual(data, shared));
        setReplicated(data);
      }
    });
  }, []);

  return (
    <Button disabled={disabled} onClick={handleSave} type="primary">
      {t("ACTIONS.SAVE")}
    </Button>
  );
};

interface IInstanceConfigExtraActions {
  Action: typeof Action;
}

const InstanceConfig: FC & IInstanceConfigExtraActions = () => {
  const { store } = useStoreActions();
  const [replicated, setReplicated] = useState<any>(store.instanceConfig);

  // Replicating data once replicated changes
  useEffect(() => {
    events.emit(InstanceEvents.SAVE_DATA, store.instanceConfig, replicated);
  }, [replicated]);

  // Listen to instanceConfig store update
  useEffect(() => {
    if (store.instanceConfig !== replicated) {
      setReplicated(store.instanceConfig);
    }
  }, [store.instanceConfig]);

  return (
    <Main>
      <PanelConfig
        config={defaultConfiguration}
        replicated={replicated}
        onReplicated={setReplicated}
      />
    </Main>
  );
};

InstanceConfig.Action = Action;

export default InstanceConfig;
