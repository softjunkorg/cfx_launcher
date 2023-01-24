// Preload (Isolated World)
import { contextBridge, ipcRenderer } from "electron";

// Request
function request(name: string, ...args: any[]) {
  return ipcRenderer.invoke(`${name}__request`, ...args); // Invoking the request
}

// Listen
function listen(
  name: string,
  callback: (event: Electron.IpcRendererEvent, ...args: any[]) => any
) {
  // Creating the request
  ipcRenderer.on(`${name}__request`, async (event, ...args) => {
    const result = callback(event, ...args);
    ipcRenderer.send(`${name}__response`, result);
  });

  return callback;
}

// Off
function off(name: string, listener: (...args: any[]) => void) {
  return ipcRenderer.removeListener(`${name}__request`, listener); // Removing the request
}

// Context
contextBridge.exposeInMainWorld("__api", {
  request,
  listen,
  off,
});
