import { App } from "antd";
import { InstanceErrors, InstanceEvents, InstanceStatus } from "types";
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
      if (result[0]) {
        setStatus(InstanceStatus.STARTING);
        message.info(t("MESSAGES.SERVER_START_SUCCESS"));
      } else {
        switch (result[1]) {
          case InstanceErrors.ARTIFACTS_FOLDER_ERROR:
            message.error(t("ERRORS.INSTANCE.ARTIFACTS_FOLDER_ERROR"));
            break;

          case InstanceErrors.RESOURCES_FOLDER_ERROR:
            message.error(t("ERRORS.INSTANCE.RESOURCES_FOLDER_ERROR"));
            break;

          default:
            message.error(t("MESSAGES.SERVER_STOP_ERROR"));
        }
      }
    }
  };

  const stop = async () => {
    if (
      status === InstanceStatus.RUNNING ||
      status === InstanceStatus.STARTING
    ) {
      const result = await application.request(InstanceEvents.STOP);
      if (result[0]) {
        setStatus(InstanceStatus.STOPPED);
        message.info(t("MESSAGES.SERVER_STOP_SUCCESS"));
      } else {
        message.error(t("ERRORS.INSTANCE.NOT_RUNNING"));
      }
    }
  };

  const restart = async () => {
    if (status === InstanceStatus.RUNNING) {
      const result = await application.request(InstanceEvents.RESTART);
      if (result[0]) {
        setStatus(InstanceStatus.STARTING);
        message.info(t("MESSAGES.SERVER_RESTART_SUCCESS"));
      } else {
        message.error(t("ERRORS.INSTANCE.NOT_RUNNING"));
      }
    }
  };

  const refresh = async () => {
    if (status === InstanceStatus.RUNNING) {
      const result = await application.request(
        InstanceEvents.EXECUTE_COMMAND,
        "refresh"
      );
      if (result[0]) {
        message.success(t("MESSAGES.SERVER_REFRESH_SUCCESS"));
      } else {
        message.error(t("ERRORS.INSTANCE.NOT_RUNNING"));
      }
    }
  };

  const executeCommand = async (command: string) => {
    if (command && status === InstanceStatus.RUNNING) {
      const result = await application.request(
        InstanceEvents.EXECUTE_COMMAND,
        command
      );
      if (result[0]) {
        message.success(t("MESSAGES.SERVER_EXECUTE_COMMAND_SUCCESS"));
      } else {
        message.error(t("ERRORS.INSTANCE.NOT_RUNNING"));
      }
    }
  };

  return { start, stop, restart, refresh, executeCommand };
}
