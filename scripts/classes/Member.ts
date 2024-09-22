import Helpers from "./Helpers";

export default class Member {
  /**
   * The member's name
   */
  name: string;

  /**
   * The member's slug
   */
  slug: string;

  /**
   * The member's path
   */
  path: string;

  constructor(name: string) {
    this.name = name;

    this.slug = Helpers.slugify(this.name);
    this.path = `/members/${this.slug}`;
  }

  static wrap(members: string[]) {
    return members.map((name) => new Member(name));
  }
}
