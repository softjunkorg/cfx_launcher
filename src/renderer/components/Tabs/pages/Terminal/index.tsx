import { FC, useEffect } from "react";
import { App } from "antd";
import { application } from "renderer/services";
import { useTranslation } from "react-i18next";
import { InstanceEvents, InstanceStatus } from "types";
import { useRecoilState } from "recoil";
import { instanceStatus } from "renderer/store/state";
import TerminalActions from "renderer/components/TerminalActions";
import Console from "renderer/components/Console";
import { Main } from "../sharedStyles";

const Terminal: FC = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [, setState] = useRecoilState(instanceStatus);

  // Listening once error is triggered
  useEffect(() => {
    const errorListener = application.listen(
      InstanceEvents.ERROR,
      (event, exitCode: number) => {
        setState(InstanceStatus.STOPPED);
        message.open({
          type: "error",
          content: t("MESSAGES.SERVER_ERROR", { code: exitCode }),
        });
      }
    );

    return () => {
      application.off(InstanceEvents.ERROR, errorListener);
    };
  }, []);

  return (
    <Main>
      <Console />
      <TerminalActions />
    </Main>
  );
};

export default Terminal;
