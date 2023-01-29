import Store from "electron-store";
import { ICustomField } from "types";
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
  },
});

export default store;
