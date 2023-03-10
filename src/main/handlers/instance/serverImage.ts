/* eslint-disable class-methods-use-this */
import * as uuid from "uuid";
import Jimp from "jimp";
import fsp from "fs/promises";
import path from "path";

class ServerImage {
  private cleanBase64(url: string): string {
    return url.replace(/^data:([A-Za-z-+/]+);base64,/, "");
  }

  public async create(url: string, folder: string, size?: [number, number]) {
    if (url && folder) {
      const base64 = this.cleanBase64(url);
      const fileID = uuid.v4();
      const fileName = size
        ? `${fileID}__BASEIMAGE.png`
        : `${fileID}__IMAGE.png`;
      const file = path.resolve(folder, fileName);

      // Creating the image
      await fsp.writeFile(file, base64, "base64");

      // Setting custom size
      if (size) {
        const image = await Jimp.read(file);
        await image
          .resize(size[0], size[1])
          .write(path.resolve(folder, `${fileID}__IMAGE.png`));

        // Deleting the the image
        await fsp.rm(file);
      }

      return path.resolve(folder, `${fileID}__IMAGE.png`);
    }

    return "";
  }

  public async delete(file: string) {
    // Removing the file
    await fsp.rm(file);
    return true;
  }
}

export default new ServerImage();
