import { ICustomField, IResource } from "../types";

const config = {
  game: {
    names: [
      {
        name: "Grand Theft Auto 5",
        value: "gta5",
      },
      {
        name: "Red Dead Redemption 2",
        value: "rdr3",
      },
    ],
    builds: {
      gta5: [2802, 2699, 2612, 2545, 2372, 2189, 2060, 1604],
      rdr3: [1491, 1436, 1355, 1311],
    },
  },
  sharedStore: {
    default: {
      instanceConfig: {
        sv_projectDesc: "Default FXServer requiring configuration",
        sv_projectName: "My FXServer Project",
        tags: [],
        locale: null,
        sv_master1: false,
        sv_scriptHookAllowed: 0,
        sv_enforceGameBuild: null,
        sv_hostname: "FXServer, but unconfigured",
        gamename: null,
        onesync: "on",
        endpoint_add_tcp: "0.0.0.0:30120",
        endpoint_add_udp: "0.0.0.0:30120",
        sv_maxClients: 48,
        sv_pureLevel: false,
        sv_endpointPrivacy: false,
        steam_webApiKey: null,
        sv_licenseKey: "changeme",
        load_server_icon: null,
        banner_detail: null,
        banner_connecting: null,
        custom_fields: [] as ICustomField[],
      },
      resources: [] as IResource[],
      settings: {
        artifactsFolder: null,
        resourcesFolder: null,
        cacheFolder: null,
        instanceArguments: null,
        themeColor: null,
        language: "en-US",
      },
      app: {
        windowSize: {
          width: 900,
          height: 500,
        },
      },
    },
  },
  languages: ["pt-BR", "en-US"],
  fields: {
    instanceConfig: {
      sv_projectDesc: "string",
      sv_projectName: "string",
      tags: "string[]",
      locale: "string",
      sv_master1: "string",
      sv_scriptHookAllowed: "number",
      sv_enforceGameBuild: "number",
      sv_hostname: "string",
      gamename: "string",
      onesync: "string",
      endpoint_add_tcp: "string",
      endpoint_add_udp: "string",
      sv_maxClients: "number",
      sv_pureLevel: "number",
      sv_endpointPrivacy: "boolean",
      steam_webApiKey: "string",
      sv_licenseKey: "string",
      load_server_icon: "string",
      banner_detail: "string",
      banner_connecting: "string",
    },
  },
};

export default config;
