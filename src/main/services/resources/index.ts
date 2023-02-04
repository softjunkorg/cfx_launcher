import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import chokidar, { FSWatcher } from "chokidar";
import lodash, { List } from "lodash";
import {
  InstanceEvents,
  IResource,
  ResourcesErrors,
  ResourcesEvents,
} from "../../../types";
import { InstanceResources } from "../../handlers/resources";
import { TempResources } from "../../handlers/instance";
import { events, store, window } from "../../utils";

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
  let resources = store.get("resources") as IResource[];

  // Checking runtime
  if (!folder || !fs.existsSync(folder) || !resources)
    return [false, ResourcesErrors.FOLDER_ERROR];

  // Creating the process
  watcherProcess = chokidar.watch(folder, {
    ignored: /(^|[/\\])node_modules$/,
  });

  // On wather process change
  watcherProcess.on("change", async (change: string) => {
    resources = store.get("resources") as IResource[];

    // Creating watchOptions paths
    const watchPaths = {} as { [x: string]: string };
    const watchResources = resources.filter(
      (r) =>
        r.active === true &&
        r?.watchOptions.active === true &&
        r?.watchOptions.paths.length > 0
    );

    // Mapping resources that need to watch
    watchResources.map((r) => {
      if (r?.watchOptions.paths) {
        r?.watchOptions.paths.map((p) => {
          watchPaths[p] = r.name;
          return true;
        });
      }

      return true;
    });

    Object.entries(watchPaths).map((row) => {
      const resource = resources.find((r) => r.name === row[1]);
      const resourcePath = path.resolve(folder, resource?.path || "");

      // Checking the resource
      if (fs.existsSync(resourcePath)) {
        if (
          path.resolve(change).startsWith(path.resolve(resourcePath, row[0]))
        ) {
          events.emit(InstanceEvents.EXECUTE_COMMAND, "refresh");
          events.emit(
            InstanceEvents.EXECUTE_COMMAND,
            resource?.watchOptions.command.replace("{{name}}", resource?.name)
          );

          // Sending message to front
          window.request(ResourcesEvents.LOCAL_CHANGE, resource?.name);

          return true;
        }
      }

      return null;
    });
  });

  // On watcher process add directory
  watcherProcess.on("addDir", async (resource: string) => {
    resources = store.get("resources") as IResource[];
    const content = await fsp.readdir(resource);
    const name = resource.split("\\")[resource.split("\\").length - 1];

    // Checking if it is really a resource
    if (
      content.includes("fxmanifest.lua") &&
      !resources.find(
        (r) => r.name === name && r.path === resource.replace(`${folder}\\`, "")
      )
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

  // On watcher process unlink directory
  watcherProcess.on("unlinkDir", async (resource: string) => {
    resources = store.get("resources") as IResource[];
    const name = resource.split("\\")[resource.split("\\").length - 1];

    // Checking if it is really a resource
    if (
      resources.find(
        (r) => r.name === name && r.path === resource.replace(`${folder}\\`, "")
      )
    ) {
      const updatedResources = resources.filter(
        (r) => r.name !== name && r.path !== resource.replace(`${folder}\\`, "")
      );

      // Updating the store
      store.set("resources", updatedResources);

      // Updating resource manifest
      tempResources.updateFields(
        updatedResources
          .filter((r) => r.active === true)
          .map((r) => `ensure ${r.name}`)
      );

      // Refreshing the terminal and ensuring the resource
      events.emit(InstanceEvents.EXECUTE_COMMAND, `stop ${name}`);
      events.emit(InstanceEvents.EXECUTE_COMMAND, "refresh");

      // Sending message to front
      window.request(ResourcesEvents.LOCAL_UNLINK, name);
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

// Change resource state
function listenToResourceState() {
  const unsubscribe = store.onDidChange("resources", (newValue, oldValue) => {
    const inspect = newValue?.filter((r) =>
      oldValue?.find((d) => d.name === r.name)
    );

    // Mapping inspect
    inspect?.map((element) => {
      if (
        oldValue?.find(
          (r) => r.name === element.name && r.active !== element.active
        )
      ) {
        // Checking element
        if (element) {
          if (element.active) {
            events.emit(
              InstanceEvents.EXECUTE_COMMAND,
              `ensure ${element.name}`
            );
          } else {
            events.emit(InstanceEvents.EXECUTE_COMMAND, `stop ${element.name}`);
          }
        }

        return true;
      }

      return false;
    });
  });

  events.on(InstanceEvents.STOPPED, unsubscribe);
}

events.on(InstanceEvents.RUNNING, listenToResourceState);
