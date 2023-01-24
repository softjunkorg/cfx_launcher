import { dialog } from "electron";
import fs from "fs";
import { window } from "../../utils";
import { SettingsEvents } from "../../../types";

// Listen to artifacts folder request
async function findArtifactsFolder() {
  async function fetchDirectory(): Promise<string | null> {
    const directory = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });

    // Checking if FXServer exists
    if (
      directory.filePaths[0] &&
      !fs.readdirSync(directory.filePaths[0]).includes("FXServer.exe")
    ) {
      await dialog.showErrorBox(
        "",
        "The selected artifacts folder is invalid."
      );

      return fetchDirectory();
    }

    return directory?.filePaths[0] || null;
  }

  return (await fetchDirectory()) || "";
}

window.listen(SettingsEvents.FIND_ARTIFACTS_FOLDER, findArtifactsFolder);

// Listen to resources folder request
async function findResourcesFolder() {
  const directory = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });

  return directory.filePaths[0] || "";
}

window.listen(SettingsEvents.FIND_RESOURCES_FOLDER, findResourcesFolder);
