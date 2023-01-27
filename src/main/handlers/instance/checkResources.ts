import fs from "fs";
import nativePath from "path";
import { store, window } from "../../utils";
import { InstanceErrors, IResource, ResourcesEvents } from "../../../types";

export default function checkResources() {
  const folder = store.get("settings.resourcesFolder") as string;
  let resources = store.get("resources") as IResource[];

  // Check runtime
  if (!folder || !fs.existsSync(folder))
    return [false, InstanceErrors.RESOURCES_FOLDER_ERROR];

  // Checking for deleted resources
  const deleted: string[] = [];
  if (resources) {
    resources.map((resource) => {
      const path = nativePath.resolve(folder, resource.path);
      if (!fs.existsSync(path)) {
        return deleted.push(resource.path);
      }
      return true;
    });
  }

  // Map deleted
  if (deleted.length > 0) {
    resources = resources.filter((r) => !deleted.includes(r.path));

    // Cleaning the store
    store.set("resources", resources);

    // Updating the front
    window.request(ResourcesEvents.DELETED, deleted.length);
  }

  return resources;
}
