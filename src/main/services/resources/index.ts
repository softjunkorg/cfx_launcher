import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { IResource, ResourcesErrors, ResourcesEvents } from "../../../types";
import { InstanceResources } from "../../handlers/resources";
import { store, window } from "../../utils";

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
