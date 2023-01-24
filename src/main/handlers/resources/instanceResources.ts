import { readdirSync } from "fs";
import { directories } from "../../utils";

const excludedPaths = ["node_modules", "cache", ".git"];
const manifestName = "fxmanifest.lua";

interface IResource {
  name: string;
  path: string;
}

class InstanceResources {
  private mainPath: string;

  private resources: Array<IResource> = [];

  constructor(path: string) {
    this.mainPath = path;
    this.get = this.get.bind(this);
    this.init();
  }

  private init() {
    const dirs = directories.getDirectoriesRecursive(
      this.mainPath,
      excludedPaths
    );
    if (dirs.length > 0) {
      dirs.map((dir: string) => {
        const content = readdirSync(dir);
        const name = dir.split("\\").slice(-1).pop();

        if (
          dir
            .split("\\")
            .map((d) => !!this.resources.find((p) => p.name.includes(d)))
            .includes(true)
        )
          return false;

        if (content.includes(manifestName)) {
          return this.resources.push({
            name: name || "default",
            path: dir,
          });
        }

        return false;
      });
    }
  }

  get(name: string): IResource | undefined {
    return this.resources.find((r) => r.name === name);
  }

  getAll(): Array<IResource> {
    return this.resources;
  }
}

export default InstanceResources;
