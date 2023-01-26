import { screen } from "electron";
import { WindowEvents } from "../../../types";
import { store, window } from "../../utils";

// Check the maximized state
renderWindow.on("maximize", () => window.request(WindowEvents.MAXIMIZED, true));
renderWindow.on("unmaximize", () =>
  window.request(WindowEvents.MAXIMIZED, false)
);

// Listening to window minimization
window.listen(WindowEvents.MINIMIZE, () => {
  renderWindow.minimize();
});

// Listening to window restoration
window.listen(WindowEvents.RESTORE, () => {
  renderWindow.restore();
});

// Listening to window maximization
window.listen(WindowEvents.MAXIMIZE, () => {
  renderWindow.maximize();
});

// Listening to window close
window.listen(WindowEvents.CLOSE, () => {
  renderWindow.close();
});

// Listening to window resize
renderWindow.on("resize", () => {
  const { width, height } = renderWindow.getBounds();
  store.set("app.windowSize", { width, height });
});
