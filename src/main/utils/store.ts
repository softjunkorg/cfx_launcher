import Store from "electron-store";
import { ICustomField, IResource } from "types";
import config from "../../config";

const store = new Store<typeof config.sharedStore.default>({
  defaults: config.sharedStore.default,
  migrations: {
    "0.0.1": (updStore) => {
      let newFields;
      const customFields = updStore.get(
        "instanceConfig.custom_fields"
      ) as ICustomField[];

      if (customFields) {
        newFields = customFields.map((field) => ({
          ...field,
          isPrivate: false,
        }));
      }

      updStore.set("instanceConfig.custom_fields", newFields);
    },
    "0.3.3": (updStore) => {
      let newResources;
      const resources = updStore.get("resources") as IResource[];

      if (resources) {
        newResources = resources.map((field) => ({
          ...field,
          watchOptions: {
            command: "ensure {{name}}",
            paths: [],
            active: false,
          },
        }));
      }

      if (newResources) updStore.set("resources", newResources);
    },
    "0.4.0": (updStore) => {
      const settings = updStore.get("settings");
      updStore.set("settings", { ...settings, themeColor: "#4a79ff" });
    },
  },
});

export default store;
