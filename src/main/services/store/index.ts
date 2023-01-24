import { app } from "electron";
import { StoreEvents } from "../../../types";
import { store, window } from "../../utils";

// Listening fetch requests
window.listen(StoreEvents.FETCH, () => {
  return store.store;
});

// Listening to front store updates
window.listen(StoreEvents.UPDATE, (event, update) => {
  store.store = update;
});

// Once store changes
function didAnyChange(value: any) {
  window.request(StoreEvents.DID_UPDATE, value);
}
const unsubscribe = store.onDidAnyChange(didAnyChange);

// Once process is finished
app.on("before-quit", unsubscribe);
