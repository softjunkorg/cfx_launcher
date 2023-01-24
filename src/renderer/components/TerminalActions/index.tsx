/* eslint-disable no-nested-ternary */
import { useInstanceStatus } from "renderer/hooks";
import { useInstanceActions } from "renderer/store/actions";
import { App, Button } from "antd";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Main } from "./styles";

const TerminalActions: FC = () => {
  const { t } = useTranslation();
  const { stop, start, refresh, restart } = useInstanceActions();
  const { isRunning, isStarting } = useInstanceStatus();
  const { modal } = App.useApp();

  // Stop the instance
  function handleStop() {
    modal.confirm({
      title: t("DIALOGS.SERVER_STOP_HEADER"),
      content: t("DIALOGS.SERVER_STOP_BODY"),
      okText: t("ACTIONS.STOP"),
      onOk: stop,
    });
  }

  // Restart the instance
  function handleRestart() {
    modal.confirm({
      title: t("DIALOGS.SERVER_RESTART_HEADER"),
      content: t("DIALOGS.SERVER_RESTART_BODY"),
      okText: t("ACTIONS.RESTART"),
      onOk: restart,
    });
  }

  return (
    <Main>
      <Button
        size="large"
        type="primary"
        danger={isRunning}
        onClick={isRunning ? handleStop : start}
        loading={isStarting}
      >
        {isRunning
          ? t("ACTIONS.STOP")
          : isStarting
          ? t("STATUS.STARTING")
          : t("ACTIONS.START")}
      </Button>
      <Button size="large" onClick={handleRestart} disabled={!isRunning}>
        {t("ACTIONS.RESTART")}
      </Button>
      <Button size="large" onClick={refresh} disabled={!isRunning}>
        {t("ACTIONS.REFRESH")}
      </Button>
    </Main>
  );
};

export default TerminalActions;
