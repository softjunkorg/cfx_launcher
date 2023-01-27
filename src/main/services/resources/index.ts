import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import chokidar, { FSWatcher } from "chokidar";
import {
  InstanceEvents,
  IResource,
  ResourcesErrors,
  ResourcesEvents,
} from "../../../types";
import { InstanceResources } from "../../handlers/resources";
import { TempResources } from "../../handlers/instance";
import { events, store, wait, window } from "../../utils";

let watcherProcess: FSWatcher | null = null;

// Listen to resources fetch request
async function fetchResources() {
  const folder = store.get("settings.resourcesFolder") as string;

  // Checking runtime
  if (!folder || !fs.existsSync(folder))
    return [false, ResourcesErrors.FOLDER_ERROR];

  const resources = new InstanceResources(folder); // Fetching the resources

  return [true, resources.getAll()];
}

window.listen(ResourcesEvents.FETCH, fetchResources);

// Listen to resource delete request
async function deleteResource(_: any, name: string) {
  const folder = store.get("settings.resourcesFolder") as string;
  const resource = store
    .get("resources")
    .find((s) => s.name === name) as IResource;

  // Checking runtime
  if (!folder || !fs.existsSync(folder))
    return [false, ResourcesErrors.FOLDER_ERROR];
  if (!resource || !fs.existsSync(path.join(folder, resource.path)))
    return [false, ResourcesErrors.INVALID_RESOURCE];

  // Deleting the resources
  try {
    await fsp.rm(path.join(folder, resource.path), {
      recursive: true,
    });

    // Cleaning the store
    store.set(
      "resources",
      store.get("resources").filter((r) => r.name !== resource.name)
    );

    return [true, null];
  } catch (err: any) {
    return [false, err.code];
  }
}

window.listen(ResourcesEvents.DELETE, deleteResource);

// Listening to resourcesFolder changes once server is started
async function startWatching(_: any, tempResources: TempResources) {
  const folder = store.get("settings.resourcesFolder") as string;

  // Checking runtime
  if (!folder || !fs.existsSync(folder))
    return [false, ResourcesErrors.FOLDER_ERROR];

  // Creating the process
  watcherProcess = chokidar.watch(folder, {
    ignored: /(^|[/\\])node_modules$/,
    persistent: true,
  });

  // On watcher process add directory
  watcherProcess.on("addDir", async (resource: string) => {
    const resources = store.get("resources") as IResource[];
    const content = await fsp.readdir(resource);
    const name = resource.split("\\")[resource.split("\\").length - 1];

    // Checking if it is really a resource
    if (
      content.includes("fxmanifest.lua") &&
      !resources.find((r) => r.name === name)
    ) {
      const updatedResources = [
        ...resources,
        {
          name,
          path: resource.replace(`${folder}\\`, ""),
          active: true,
        },
      ];

      // Updating the store
      store.set("resources", updatedResources);

      // Updating resource manifest
      tempResources.updateFields(
        updatedResources
          .filter((r) => r.active === true)
          .map((r) => `ensure ${r.name}`)
      );

      // Refreshing the terminal and ensuring the resource
      events.emit(InstanceEvents.EXECUTE_COMMAND, "refresh");
      events.emit(InstanceEvents.EXECUTE_COMMAND, `ensure ${name}`);

      // Sending message to front
      window.request(ResourcesEvents.LOCAL_UPDATE, name);
    }
  });

  return true;
}

events.on(InstanceEvents.RUNNING, startWatching);

// Listening to cancel file watcher
function stopWatching() {
  // Stopping the process
  watcherProcess?.close();
  watcherProcess = null;
}

events.on(InstanceEvents.STOPPED, stopWatching);
