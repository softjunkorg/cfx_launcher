import { App } from "antd";
import { InstanceEvents, InstanceStatus } from "types";
import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import { application } from "renderer/services";
import { instanceStatus } from "../state/instance";

export default function useInstanceActions() {
  const [status, setStatus] = useRecoilState(instanceStatus);
  const { t } = useTranslation();
  const { message } = App.useApp();

  const start = async () => {
    if (status === InstanceStatus.STOPPED) {
      const result = await application.request(InstanceEvents.START);
      if (result) {
        setStatus(InstanceStatus.STARTING);
        message.open({
          type: "success",
          content: t("MESSAGES.SERVER_START_SUCCESS"),
        });
      } else {
        message.open({
          type: "error",
          content: t("MESSAGES.SERVER_START_ERROR"),
        });
      }
    }
  };

  const stop = async () => {
    if (
      status === InstanceStatus.RUNNING ||
      status === InstanceStatus.STARTING
    ) {
      const result = await application.request(InstanceEvents.STOP);
      if (result) {
        setStatus(InstanceStatus.STOPPED);
        message.open({
          type: "info",
          content: t("MESSAGES.SERVER_STOP_SUCCESS"),
        });
      } else {
        message.open({
          type: "error",
          content: t("MESSAGES.SERVER_STOP_ERROR"),
        });
      }
    }
  };

  const restart = async () => {
    if (status === InstanceStatus.RUNNING) {
      const result = await application.request(InstanceEvents.RESTART);
      if (result) {
        setStatus(InstanceStatus.STARTING);
        message.open({
          type: "success",
          content: t("MESSAGES.SERVER_RESTART_SUCCESS"),
        });
      } else {
        message.open({
          type: "error",
          content: t("MESSAGES.SERVER_RESTART_ERROR"),
        });
      }
    }
  };

  const refresh = async () => {
    if (status === InstanceStatus.RUNNING) {
      const result = await application.request(
        InstanceEvents.EXECUTE_COMMAND,
        "refresh"
      );
      if (result) {
        message.open({
          type: "success",
          content: t("MESSAGES.SERVER_REFRESH_SUCCESS"),
        });
      } else {
        message.open({
          type: "error",
          content: t("MESSAGES.SERVER_REFRESH_ERROR"),
        });
      }
    }
  };

  const executeCommand = async (command: string) => {
    if (command && status === InstanceStatus.RUNNING) {
      const result = await application.request(
        InstanceEvents.EXECUTE_COMMAND,
        command
      );
      if (result) {
        message.open({
          type: "success",
          content: t("MESSAGES.SERVER_EXECUTE_COMMAND_SUCCESS"),
        });
      } else {
        message.open({
          type: "error",
          content: t("MESSAGES.SERVER_EXECUTE_COMMAND_ERROR"),
        });
      }
    }
  };

  return { start, stop, restart, refresh, executeCommand };
}
