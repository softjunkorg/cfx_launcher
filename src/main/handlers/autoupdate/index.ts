/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import { autoUpdater } from "electron-updater";

export default class AppUpdater {
  constructor() {
    const log = require("electron-log");
    log.transports.file.level = "debug";
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}
