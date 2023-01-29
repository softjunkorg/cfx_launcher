import { spawn } from "child_process";
import { app } from "electron";
import fs from "fs";
import path from "path";
import {
  IInstanceMessage,
  InstanceErrors,
  InstanceEvents,
  InstanceStatus,
  IResource,
  TInstanceProcess,
} from "../../../types";
import {
  checkResources,
  TempConfig,
  TempResources,
} from "../../handlers/instance";
import { ansi, cache, events, store, wait, window } from "../../utils";

let instanceProcess: TInstanceProcess;
let instanceStatus: InstanceStatus = InstanceStatus.STOPPED;
let instanceTempConfig: TempConfig | null;
let instanceTempResources: TempResources | null;

// Stop the instance
async function stopInstance() {
  if (
    !instanceProcess ||
    !instanceTempConfig ||
    !instanceTempResources ||
    (instanceStatus !== InstanceStatus.RUNNING &&
      instanceStatus !== InstanceStatus.STARTING)
  )
    return [false, InstanceErrors.NOT_RUNNING];

  // Killing the task
  await instanceProcess.kill();
  await instanceTempConfig.delete();
  await instanceTempResources.delete();
  instanceTempConfig = null;
  instanceTempResources = null;
  instanceProcess = null;

  // Notifiying the front
  await wait(500);
  window.request(InstanceEvents.STOPPED);
  events.emit(InstanceEvents.STOPPED);
  instanceStatus = InstanceStatus.STOPPED;

  return [true, null];
}

window.listen(InstanceEvents.STOP, stopInstance);
app.on("before-quit", stopInstance);

// Start the instance
async function startInstance() {
  const artifactsFolder = store.get("settings.artifactsFolder") as string;
  const resourcesFolder = store.get("settings.resourcesFolder") as string;
  const instanceConfig = store.get("instanceConfig");

  // Checking for directory
  if (!artifactsFolder || !fs.existsSync(artifactsFolder))
    return [false, InstanceErrors.ARTIFACTS_FOLDER_ERROR];
  if (!resourcesFolder || !fs.existsSync(resourcesFolder))
    return [false, InstanceErrors.RESOURCES_FOLDER_ERROR];

  // Checking the resources
  const resources = checkResources() as IResource[];

  // Creating temporaty config and resources
  instanceTempConfig = new TempConfig(
    instanceConfig,
    artifactsFolder,
    cache.getFolder()
  );
  instanceTempResources = new TempResources(
    resources.filter((r) => r.active === true).map((r) => `ensure ${r.name}`),
    artifactsFolder
  );

  const tempPath = await instanceTempConfig.create();
  const resourcesPath = await instanceTempResources.create();

  // Starting the instance
  instanceProcess = spawn(
    path.join(artifactsFolder, "FXServer.exe"),
    ["+exec", `${tempPath}`, "+exec", `${resourcesPath}`],
    {
      cwd: path.resolve(resourcesFolder, "../"),
    }
  );

  // Sending starting widget
  window.request(InstanceEvents.MESSAGE, {
    type: "widget",
    content: { icon: "info", message: "Sever starting..." },
  } as IInstanceMessage);

  // Subscribe for terminal data
  let currentLine = "";
  const onData = (data: any) => {
    const message = data.toString();

    function matchBreaks() {
      let count = 0;

      [...message.matchAll(/\n/g)].forEach((row) => {
        if (row.index !== message.length - 1) {
          count += 1;
        }
      });

      return count;
    }

    if (matchBreaks() > 0) {
      const map = message.split("\n");
      return map.forEach((m: any, i: number) =>
        onData(`${m}${i + 1 !== map.length ? "\n" : ""}`)
      );
    }

    // Adding the line
    currentLine += message;

    // Checking the last break line
    if (currentLine.includes("\n", currentLine.length - 1)) {
      // Checking if instance is running
      if (
        ansi
          .strip(currentLine)
          .includes("[ citizen-server-impl] Authenticated with cfx.re Nucleus:")
      ) {
        renderWindow.setProgressBar(0);
        window.request(InstanceEvents.RUNNING);
        events.emit(
          InstanceEvents.RUNNING,
          instanceTempConfig,
          instanceTempResources
        );
        instanceStatus = InstanceStatus.RUNNING;

        // Sending authenticated widget
        setTimeout(() => {
          window.request(InstanceEvents.MESSAGE, {
            type: "widget",
            isInternational: true,
            content: { icon: "success", message: "Server authenticated" },
          } as IInstanceMessage);
        }, 5);
      }

      // Sending the data
      window.request(InstanceEvents.MESSAGE, {
        type: "message",
        content: currentLine,
      } as IInstanceMessage);
      currentLine = "";
    }

    return true;
  };

  instanceProcess.stdout.on("data", onData);

  // Listening to process closing
  const onFinish = async (code: number) => {
    if (instanceProcess) {
      window.request(InstanceEvents.ERROR, code);

      // Cleaning the tasks
      if (instanceStatus === InstanceStatus.STARTING) {
        renderWindow.setProgressBar(0);
      }

      // Stopping the instance
      await stopInstance();
    }
  };

  instanceProcess.on("exit", onFinish);
  instanceProcess.on("close", onFinish);

  // Creating window loader
  renderWindow.setProgressBar(2);
  window.request(InstanceEvents.STARTING);
  events.emit(
    InstanceEvents.STARTING,
    instanceTempConfig,
    instanceTempResources
  );
  instanceStatus = InstanceStatus.STARTING;

  return [true, null];
}

window.listen(InstanceEvents.START, startInstance);

// Restart the instance
async function restartInstance() {
  if (
    !instanceProcess ||
    !instanceTempConfig ||
    !instanceTempResources ||
    instanceStatus !== InstanceStatus.RUNNING
  )
    return [false, InstanceErrors.NOT_RUNNING];

  // Restarting the instance
  await stopInstance();
  await startInstance();

  return [true, null];
}

window.listen(InstanceEvents.RESTART, restartInstance);

// Execute command on the instance
async function executeInstanceCommand(
  event: Electron.IpcMainInvokeEvent | null,
  command: string
) {
  if (
    !instanceProcess ||
    !instanceTempConfig ||
    !instanceTempResources ||
    instanceStatus !== InstanceStatus.RUNNING
  )
    return [false, InstanceErrors.NOT_RUNNING];

  // Executing the commnad
  instanceProcess.stdin.write(`${command}\n`);
  events.emit(InstanceEvents.COMMAND_EXECUTED, command);

  return [true, null];
}

window.listen(InstanceEvents.EXECUTE_COMMAND, executeInstanceCommand);
events.on(InstanceEvents.EXECUTE_COMMAND, (command: string) => {
  executeInstanceCommand(null, command);
});
