import { ChildProcessWithoutNullStreams } from "child_process";

export enum InstanceStatus {
  STOPPED = "INSTANCE_STOPPED",
  STARTING = "INSTANCE_STARTING",
  RUNNING = "INSTANCE_RUNNING",
}

export enum InstanceEvents {
  EXECUTE_COMMAND = "INSTANCE::EXECUTE_COMMAND",
  COMMAND_EXECUTED = "INSTANCE::COMMAND_EXECUTED",
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

export enum InstanceErrors {
  ARTIFACTS_FOLDER_ERROR = "ERROR::INSTANCE_ARTIFACTS_FOLDER_ERROR",
  RESOURCES_FOLDER_ERROR = "ERROR::INSTANCE_RESOURCES_FOLDER_ERROR",
  NOT_RUNNING = "ERROR::INSTANCE_NOT_RUNNING",
}

export interface IInstanceWidget {
  icon: "success" | "error" | "warning" | "info";
  message: string;
}

export interface IInstanceMessage {
  type: "message" | "widget";
  isInternational: boolean;
  content: string | IInstanceWidget;
}

export type TInstanceProcess = ChildProcessWithoutNullStreams | null;
