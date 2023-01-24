/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import { app, BrowserWindow } from "electron";
import path from "path";
import { directories } from "./utils";

// Check debug
const isDebug =
  process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";

if (isDebug) {
  require("electron-debug")();
}

function createWindow() {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, "assets")
    : path.join(__dirname, "../../assets");

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const window = new BrowserWindow({
    minWidth: 800,
    width: 800,
    minHeight: 500,
    height: 500,
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
  global.renderWindow = window;
}

app.on("ready", () => {
  createWindow(); // Creating the window
  require("./services"); // Setting up services
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
