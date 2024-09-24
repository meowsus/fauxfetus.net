import slugify from "slugify";

export default class Helpers {
  static slugify(name: string) {
    return slugify(name, { strict: true, lower: true });
  }
}
