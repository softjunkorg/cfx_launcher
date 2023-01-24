import { app } from "electron";
import { spawn } from "child_process";
import path from "path";
import { window, store, wait } from "../../../main/utils";
import {
  InstanceEvents,
  InstanceStatus,
  IResource,
  TInstanceProcess,
} from "../../../types";
import { TempConfig, TempResources } from "../../../main/handlers/instance";

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
    return false;

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
  instanceStatus = InstanceStatus.STOPPED;

  return true;
}

window.listen(InstanceEvents.STOP, stopInstance);
app.on("before-quit", stopInstance);

// Start the instance
async function startInstance() {
  const artifactsFolder = store.get("settings.artifactsFolder") as string;
  const resourcesFolder = store.get("settings.resourcesFolder") as string;
  const resources = store.get("resources") as IResource[];
  const instanceConfig = store.get("instanceConfig");

  // Checking for directory
  if (
    !artifactsFolder ||
    !resourcesFolder ||
    !resources ||
    !instanceConfig ||
    instanceProcess
  )
    return false;

  // Creating temporaty config and resources
  instanceTempConfig = new TempConfig(instanceConfig, artifactsFolder);
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

  // Subscribe for terminal data
  const onData = (data: any) => {
    const message = data.toString();

    // Checking if instance is running
    if (message.includes("Authenticated with cfx.re")) {
      renderWindow.setProgressBar(0);
      window.request(InstanceEvents.RUNNING);
      instanceStatus = InstanceStatus.RUNNING;
    }

    window.request(InstanceEvents.MESSAGE, message); // Sending the data
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
  instanceStatus = InstanceStatus.STARTING;

  return true;
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
    return false;

  // Restarting the instance
  await stopInstance();
  await startInstance();

  return true;
}

window.listen(InstanceEvents.RESTART, restartInstance);

// Execute command on the instance
async function executeInstanceCommand(
  event: Electron.IpcMainInvokeEvent,
  command: string
) {
  if (
    !instanceProcess ||
    !instanceTempConfig ||
    !instanceTempResources ||
    instanceStatus !== InstanceStatus.RUNNING
  )
    return false;

  // Executing the commnad
  instanceProcess.stdin.write(`${command}\n`);
  // window.request("INSTANCE_COMMAND_EXECUTED", command);

  return true;
}

window.listen(InstanceEvents.EXECUTE_COMMAND, executeInstanceCommand);
