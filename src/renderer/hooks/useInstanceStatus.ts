import { useRecoilValue } from "recoil";
import { instanceStatus } from "renderer/store/state";
import { InstanceStatus } from "types";

export default function useInstanceStatus() {
  const status = useRecoilValue(instanceStatus);
  const isStopped = status === InstanceStatus.STOPPED;
  const isRunning = status === InstanceStatus.RUNNING;
  const isStarting = status === InstanceStatus.STARTING;

  return { status, isStopped, isRunning, isStarting };
}
