import { mkdir, writeFile } from "fs/promises";
import slugify from "slugify";

export default class Helpers {
  static slugify(name: string) {
    return slugify(name, { strict: true, lower: true });
  }

  static async writeJson(path: string, data: any) {
    const dir = path.substring(0, path.lastIndexOf("/"));
    await mkdir(dir, { recursive: true });
    await writeFile(path, JSON.stringify(data));
  }
}
