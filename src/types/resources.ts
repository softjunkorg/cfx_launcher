export enum ResourcesEvents {
  FETCH = "RESOURCES::FETCH",
  DELETE = "RESORUCES::DELETE",
  REFRESH = "RESORUCES::REFRESH",
}

export enum ResourcesErrors {
  NO_FOLDER_SET = "ERROR::NO_FOLDER_SET",
  FOLDER_DOESNT_EXISTS = "ERROR::FOLDER_DOESNT_EXISTS",
  INVALID_RESOURCE = "ERROR::INVALID_RESOURCE",
}

export interface IResource {
  name: string;
  path: string;
  active: boolean;
}
