import { readdirSync, statSync } from "fs";
import path from "path";

export function flatten(lists: any[]) {
  return lists.reduce((a, b) => a.concat(b), []);
}

export function getDirectories(src: string) {
  return readdirSync(src)
    .map((file) => path.join(src, file))
    .filter((fpath) => statSync(fpath).isDirectory());
}

export function getDirectoriesRecursive(
  src: string,
  excludedPaths?: Array<string>
): Array<string> {
  if (excludedPaths?.map((p) => src.includes(p)).includes(true)) return [];
  return [
    src,
    ...flatten(
      getDirectories(src).map((v) => getDirectoriesRecursive(v, excludedPaths))
    ),
  ];
}

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === "development") {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, "../renderer/", htmlFileName)}`;
}
