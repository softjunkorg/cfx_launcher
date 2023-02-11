/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import { app, BrowserWindow, Notification } from "electron";
import path from "path";
import { directories, notifications, store } from "./utils";
import AutoUpdater from "./handlers/autoupdate";
import config from "../config";

// Single instance
app.requestSingleInstanceLock();

// Check debug
const isDebug =
  process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";

// Adding debug
if (isDebug) {
  require("electron-debug")();
}

// Getting resources
const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, "assets")
  : path.join(__dirname, "../../assets");

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

function createWindow() {
  // Getting default window size
  const width = store.get("app.windowSize.width") as number;
  const height = store.get("app.windowSize.height") as number;

  // Creating the window
  const window = new BrowserWindow({
    width, // Dynamic width
    height, // Dynamic height
    minWidth: config.sharedStore.default.app.windowSize.width,
    minHeight: config.sharedStore.default.app.windowSize.height,
    frame: false,
    icon: getAssetPath("icon.png"),
    autoHideMenuBar: true,
    webPreferences: {
      devTools: !app.isPackaged,
      preload: app.isPackaged
        ? path.join(__dirname, "preload.js")
        : path.join(__dirname, "../../.app/dll/preload.js"),
    },
  });

  // Loading the window
  window.loadURL(directories.resolveHtmlPath("index.html"));

  // Setting the global
  (global as any).renderWindow = window;

  // Enabling auto updater
  // eslint-disable-next-line
  new AutoUpdater();
}

app
  .whenReady()
  .then(() => {
    createWindow(); // Creating the window
    require("./services"); // Setting up services
    return true;
  })
  .catch((err) => {
    throw new Error(err);
  });

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
