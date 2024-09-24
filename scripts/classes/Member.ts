import Helpers from "./Helpers";

export default class Member {
  /**
   * The member's name
   */
  name: string;

  /**
   * The member's path
   */
  path: string;

  constructor(name: string) {
    this.name = name;

    this.path = `/members/${Helpers.slugify(this.name)}`;
  }

  static wrap(members: string[]) {
    return members.map((name) => new Member(name));
  }
}
