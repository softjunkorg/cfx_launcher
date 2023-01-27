import { app, dialog } from "electron";
import { autoUpdater } from "electron-updater";

autoUpdater.autoDownload = false;

// Listening to auto update errors
autoUpdater.on("error", (error) => {
  dialog.showErrorBox(
    "Error: ",
    error == null ? "unknown" : (error.stack || error).toString()
  );
});

// Once update is available
autoUpdater.on("update-available", () => {
  dialog
    .showMessageBox({
      type: "info",
      title: "Found Updates",
      message: "Found updates, do you want update now?",
      buttons: ["Yes", "No"],
    })
    .then((buttonIndex) => {
      if ((buttonIndex as unknown as number) === 0) {
        autoUpdater.downloadUpdate();
      }
      return true;
    })
    .catch((err) => {
      throw new Error(err);
    });
});

// Once update is downloaded
autoUpdater.on("update-downloaded", () => {
  dialog
    .showMessageBox({
      title: "Install Updates",
      message: "Updates downloaded, application will be quit for update...",
    })
    .then(() => autoUpdater.quitAndInstall(true))
    .catch((err) => {
      throw new Error(err);
    });
});

// Listening to app start, then check for updates
app
  .whenReady()
  .then(() => autoUpdater.checkForUpdates())
  .catch((err) => {
    throw new Error(err);
  });
