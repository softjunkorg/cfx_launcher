import { ipcMain, IpcMainInvokeEvent } from "electron";

// Listening
function listen(
  name: string,
  callback: (event: IpcMainInvokeEvent, ...args: any[]) => any
) {
  ipcMain.handle(`${name}__request`, callback);
}

// Sending
async function request<T = any>(name: string, ...args: any[]): Promise<T> {
  return new Promise((resolve) => {
    renderWindow.webContents.send(`${name}__request`, ...args);
    ipcMain.on(`${name}__response`, (_, ...result) =>
      resolve.apply(null, result as any)
    );
  });
}

export { listen, request };
