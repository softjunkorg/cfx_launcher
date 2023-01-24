import fs from "fs/promises";
import path from "path";
import { IResource, ResourcesErrors, ResourcesEvents } from "../../../types";
import { InstanceResources } from "../../handlers/resources";
import { store, window } from "../../utils";

// Listen to resources fetch request
async function fetchResources() {
  const folder = store.get("settings.resourcesFolder") as string;

  // Checking runtime
  if (!folder) return [false, ResourcesErrors.NO_FOLDER_SET];
  if (
    !(await fs
      .access(folder)
      .then(() => true)
      .catch(() => false))
  )
    return [false, ResourcesErrors.FOLDER_DOESNT_EXISTS];

  const resources = new InstanceResources(folder); // Fetching the resources

  return [true, resources.getAll()];
}

window.listen(ResourcesEvents.FETCH, fetchResources);

// Listen to resource delete request
async function deleteResource(_: any, name: string) {
  const resourcesFolder = store.get("settings.resourcesFolder") as string;
  const resource = store
    .get("resources")
    .find((s) => s.name === name) as IResource;

  // Checking runtime
  if (!resource || !resourcesFolder)
    return [false, ResourcesErrors.INVALID_RESOURCE];
  if (
    !(await fs
      .access(path.join(resourcesFolder, resource.path))
      .then(() => true)
      .catch(() => false))
  )
    return [false, ResourcesErrors.FOLDER_DOESNT_EXISTS];

  // Deleting the resources
  try {
    await fs.rm(path.join(resourcesFolder, resource.path), {
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
