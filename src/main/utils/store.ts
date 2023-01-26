import Store from "electron-store";
import config from "../../config";

const store = new Store<typeof config.sharedStore.default>({
  defaults: config.sharedStore.default,
});

export default store;
