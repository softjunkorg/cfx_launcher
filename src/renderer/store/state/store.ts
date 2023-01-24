import { atom } from "recoil";
import config from "config";

export const storeData = atom<typeof config.sharedStore.default>({
  key: "storeData",
  default: config.sharedStore.default,
});
