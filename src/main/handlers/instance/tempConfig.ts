/* eslint-disable no-fallthrough */
import * as uuid from "uuid";
import fs from "fs/promises";
import path from "path";
import config from "../../../config";
import ServerImage from "./serverImage";

class TempConfig {
  private replicated = {
    load_server_icon: "",
  };

  private fields: { [x: string]: any } = {};

  private isCreated = false;

  private folder = "";

  private cache = "";

  private file = "";

  private fileID = "";

  constructor(fields: object, folder: string, cache: string) {
    this.fields = fields;
    this.folder = folder;
    this.cache = cache;
  }

  private async startReplicated() {
    // Loading the server icon
    if (!this.replicated.load_server_icon) {
      this.replicated.load_server_icon = await ServerImage.create(
        this.fields.load_server_icon,
        this.cache,
        [96, 96]
      );
    }

    return true;
  }

  private async deleteReplicated() {
    // Unloading the server icon
    if (this.replicated.load_server_icon) {
      await ServerImage.delete(this.replicated.load_server_icon);
      this.replicated.load_server_icon = "";
    }

    return true;
  }

  private mapFields() {
    // Mapping the entries of config
    const { replicated } = this;
    const file = Object.entries(this.fields).map((row) => {
      const key = row[0];
      let value = row[1] as string | string[] | boolean | number;

      if (key && value !== null && value !== false && value !== "false") {
        let prefix = "";

        // Check for replicated values
        if (replicated[key as keyof typeof replicated]) {
          value = replicated[key as keyof typeof replicated];
        }

        // Changing prefix
        switch (key) {
          case "tags":
          case "locale":
          case "sv_projectName":
          case "sv_projectDesc":
          case "banner_detail":
          case "banner_connecting":
            prefix = "sets ";

          // eslint-disable-next-line no-fallthrough
          default:
            break;
        }

        // Mapping based on fields type
        switch (
          config.fields.instanceConfig[
            key as keyof typeof config.fields.instanceConfig
          ]
        ) {
          case "string":
            return `${prefix + key} "${value as string}"`;

          case "string[]":
            return `${prefix + key} "${(value as string[]).join(", ")}"`;

          case "number":
          case "boolean":
            return `${prefix + key} ${value as number | boolean}`;

          default:
            return `${prefix + key} ${value as string}`;
        }
      }

      return null;
    });

    return file.filter((d) => d !== null).join("\n") || "EMPTY DATA";
  }

  public async create() {
    if (this.fields && this.folder) {
      this.fileID = uuid.v4();
      this.file = path.resolve(this.folder, `${this.fileID}__CONFIG.cfg`);

      // Creating the file
      await this.startReplicated();
      await fs.writeFile(this.file, this.mapFields());
      this.isCreated = true;

      return this.file;
    }

    return false;
  }

  public async delete() {
    if (this.isCreated && this.file) {
      await this.deleteReplicated();
      await fs.rm(this.file);

      // Cleaning the cache
      this.isCreated = false;
      this.file = "";

      return true;
    }

    return false;
  }
}

export default TempConfig;
