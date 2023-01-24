import { atom } from "recoil";
import { InstanceStatus } from "types";

export const instanceStatus = atom<InstanceStatus>({
  key: "instanceStatus",
  default: InstanceStatus.STOPPED,
});
