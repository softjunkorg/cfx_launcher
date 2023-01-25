export enum ResourcesEvents {
  FETCH = "RESOURCES::FETCH",
  DELETE = "RESORUCES::DELETE",
  REFRESH = "RESORUCES::REFRESH",
}

export enum ResourcesErrors {
  FOLDER_ERROR = "ERROR::RESOURCES_FOLDER_ERROR",
  INVALID_RESOURCE = "ERROR::RESOURCES_INVALID_RESOURCE",
}

export interface IResource {
  name: string;
  path: string;
  active: boolean;
}
