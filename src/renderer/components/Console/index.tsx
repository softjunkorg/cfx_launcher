import { useInstanceStatus } from "renderer/hooks";
import { application } from "renderer/services";
import { useInstanceActions } from "renderer/store/actions";
import { instanceStatus } from "renderer/store/state";
import { InstanceEvents, InstanceStatus } from "types";
import Line from "ansi-to-react";
import { App, Button, Input, Result } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TbTerminal } from "react-icons/tb";
import { useRecoilState } from "recoil";
import {
  Main,
  Messages,
  Messenger,
  MessengerIcon,
  StoppedMessage,
} from "./styles";

const Console: FC = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const { executeCommand } = useInstanceActions();
  const { isStarting, isRunning, isStopped } = useInstanceStatus();
  const [, setStatus] = useRecoilState(instanceStatus);
  const [messages, setMessages] = useState<string[]>([]);
  const [command, setCommand] = useState<string>("");
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Listen to messages update
  useEffect(() => {
    const runningListener = application.listen(InstanceEvents.RUNNING, () => {
      setStatus(InstanceStatus.RUNNING);
      message.open({
        type: "success",
        content: t("MESSAGES.SERVER_STARTED"),
      });
    });

    const messageListener = application.listen(
      InstanceEvents.MESSAGE,
      (event, data: string) => {
        setMessages((store) => [...store, data]);
      }
    );

    const stopListener = application.listen(InstanceEvents.STOPPED, () => {
      setMessages([]);
    });

    // Cleanup
    return () => {
      application.off(InstanceEvents.RUNNING, runningListener);
      application.off(InstanceEvents.MESSAGE, messageListener);
      application.off(InstanceEvents.STOPPED, stopListener);
    };
  }, []);

  // Updating messages last position
  useEffect(() => {
    lastMessageRef?.current?.scrollIntoView();
  });

  // Handling command insertion
  const handleSendCommand = async () => {
    if (command.length > 0) {
      await executeCommand(command);
      setCommand("");
    }
  };

  return (
    <Main>
      {/* Stop Message */}
      {isStopped && (
        <StoppedMessage>
          <Result
            status="error"
            title={t("STATUS.STOPPED")}
            subTitle={t("MESSAGES.SERVER_STOPPED")}
          />
        </StoppedMessage>
      )}

      {/* Messages */}
      <Messages>
        {(isStarting || isRunning) &&
          messages.map((row) => <Line key={Math.random()}>{row}</Line>)}
        <div ref={lastMessageRef} />
      </Messages>

      {/* Messenger */}
      <Messenger>
        <MessengerIcon>
          <TbTerminal />
        </MessengerIcon>
        <Input
          value={command}
          onInput={(e) => setCommand(e.currentTarget.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendCommand()}
          bordered={false}
          size="large"
        />
        <Button onClick={handleSendCommand} size="small" type="text">
          {t("ACTIONS.SEND")}
        </Button>
      </Messenger>
    </Main>
  );
};

export default Console;
