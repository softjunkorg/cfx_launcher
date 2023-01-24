import { ChildProcessWithoutNullStreams } from "child_process";

export enum InstanceStatus {
  STOPPED = "INSTANCE_STOPPED",
  STARTING = "INSTANCE_STARTING",
  RUNNING = "INSTANCE_RUNNING",
}

export enum InstanceEvents {
  EXECUTE_COMMAND = "INSTANCE::EXECUTE_COMMAND",
  MESSAGE = "INSTANCE::MESSAGE",
  RESTART = "INSTANCE::RESTART",
  RUNNING = "INSTANCE::RUNNING",
  START = "INSTANCE::START",
  STARTING = "INSTANCE::STARTING",
  STOP = "INSTANCE::STOP",
  STOPPED = "INSTANCE::STOPPED",
  ERROR = "INSTANCE::ERROR",
  SAVE_DATA = "INSTACE::SAVE_DATA",
}

export type TInstanceProcess = ChildProcessWithoutNullStreams | null;