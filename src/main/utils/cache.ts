import fs from "fs";
import { hideSync } from "hidefile";
import path from "path";
import store from "./store";

// Getting folder
export function getFolder() {
  const folder = store.get("settings.resourcesFolder") as string;
  const nested = store.get("settings.cacheFolder") as string;
  const name = ".launcher_cache";
  const pathTo = path.resolve(folder, "../", name);

  // Checking existency
  if (!fs.existsSync(pathTo)) {
    fs.mkdirSync(pathTo);
    hideSync(pathTo);
  }

  // Nested config on store
  if (nested && nested !== pathTo) {
    if (fs.existsSync(nested)) fs.rmdirSync(nested);
    store.set("settings.cacheFolder", pathTo);
  }

  return pathTo;
}
