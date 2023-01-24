import * as uuid from "uuid";
import fs from "fs/promises";
import path from "path";

class TempConfig {
  private fields: string[] = [];

  private isCreated = false;

  private folder = "";

  private file = "";

  private fileID = "";

  constructor(fields: string[], folder: string) {
    this.fields = fields;
    this.folder = folder;
  }

  private mapFields() {
    return this.fields.filter((d) => d !== null).join("\n") || "EMPTY DATA";
  }

  public async create() {
    if (this.fields && this.folder) {
      this.fileID = uuid.v4();
      this.file = path.resolve(this.folder, `${this.fileID}__RESOURCES.cfg`);

      // Creating the file
      await fs.writeFile(this.file, this.mapFields());
      this.isCreated = true;

      return this.file;
    }

    return false;
  }

  public async delete() {
    if (this.isCreated && this.file) {
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
