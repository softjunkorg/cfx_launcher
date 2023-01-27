import { useInstanceStatus } from "renderer/hooks";
import { application } from "renderer/services";
import { useInstanceActions } from "renderer/store/actions";
import { instanceStatus } from "renderer/store/state";
import { InstanceEvents, InstanceStatus, ResourcesEvents } from "types";
import Line from "ansi-to-react";
import { App, Button, Input, InputRef, Result } from "antd";
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
  const [sessionCommands, setSessionCommands] = useState({
    index: null as number | null,
    commands: [] as string[],
  });
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const mensagerRef = useRef<InputRef>(null);

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
      setSessionCommands({ commands: [], index: null });
      setMessages([]);
    });

    const localResourcesUpdate = application.listen(
      ResourcesEvents.LOCAL_UPDATE,
      (event, resource: string) => {
        message.info(t("MESSAGES.RESOURCE_ADDED", { resource }));
      }
    );

    // Cleanup
    return () => {
      application.off(InstanceEvents.RUNNING, runningListener);
      application.off(InstanceEvents.MESSAGE, messageListener);
      application.off(InstanceEvents.STOPPED, stopListener);
      application.off(ResourcesEvents.LOCAL_UPDATE, localResourcesUpdate);
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

      // Updating session commands
      setSessionCommands((obj) => ({
        ...obj,
        commands: [...obj.commands, command],
      }));

      setCommand("");
    }
  };

  // Find session command
  const handleFindSessionCommand = (upwards: boolean) => {
    let result = "";
    let { index } = sessionCommands;
    const { commands } = sessionCommands;

    // Upwards
    if (upwards) {
      if (index === null) {
        index = commands.length;
      }

      if (index <= commands.length && index !== 0) {
        index -= 1;
        result = commands[index];
      } else if (index === 0) {
        [result] = commands;
      }
    }

    // Not upwards
    if (!upwards) {
      if (index !== null && index < commands.length - 1) {
        index += 1;
        result = commands[index];
      } else if (index === commands.length - 1) {
        index = null;
      }
    }

    // Chaning the stored data
    setSessionCommands((obj) => ({ ...obj, index }));

    return result;
  };

  // Handling the keypress
  const handleKeyDown = (e: any) => {
    switch (e.key) {
      case "Enter":
        handleSendCommand();
        break;

      case "ArrowUp":
        setCommand(handleFindSessionCommand(true));
        setTimeout(() => mensagerRef.current?.focus({ cursor: "end" }), 5);
        break;

      case "ArrowDown":
        setCommand(handleFindSessionCommand(false));
        setTimeout(() => mensagerRef.current?.focus({ cursor: "end" }), 5);
        break;

      default:
        break;
    }
  };

  return (
    <Main>
      {/* Messages */}
      <Messages scroll={!isStopped}>
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
          onKeyDown={handleKeyDown}
          bordered={false}
          ref={mensagerRef}
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
