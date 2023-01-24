import Store from "electron-store";
import config from "../../config";

const store = new Store({
  defaults: config.sharedStore.default,
});

export default store;
