export enum ResourcesEvents {
  FETCH = "RESOURCES::FETCH",
  DELETE = "RESORUCES::DELETE",
  REFRESH = "RESORUCES::REFRESH",
  DELETED = "RESOURCES::DELETED",
  LOCAL_CHANGE = "RESOURCES::LOCAL_CHANGE",
  LOCAL_UPDATE = "RESOURCES::LOCAL_UPDATE",
  LOCAL_UNLINK = "RESOURCES::LOCAL_UNLINK",
}

export enum ResourcesErrors {
  FOLDER_ERROR = "ERROR::RESOURCES_FOLDER_ERROR",
  INVALID_RESOURCE = "ERROR::RESOURCES_INVALID_RESOURCE",
}

export interface IWatchOptions {
  command: string;
  paths: string[];
  active: boolean;
}

export interface IResource {
  name: string;
  path: string;
  active: boolean;
  watchOptions: IWatchOptions;
}

export interface ICustomField {
  name: string;
  value: string;
  isPrivate: boolean;
}
