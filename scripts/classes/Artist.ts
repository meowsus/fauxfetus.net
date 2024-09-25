import Album from "./Album";
import Helpers from "./Helpers";
import Member from "./Member";

export default class Artist {
  /**
   * The artist's name
   */
  name: string;

  /**
   * The artist's path
   */
  path: string;

  /**
   * The artist's members
   */
  memberMap: Map<string, Member>;

  /**
   * The artist's albums
   */
  albumMap: Map<string, Album>;

  constructor(name: string) {
    this.name = name;

    this.path = `/artists/${Helpers.slugify(name)}`;

    this.albumMap = new Map();
    this.memberMap = new Map();
  }

  get members() {
    return Array.from(this.memberMap.values());
  }

  add(album: Album) {
    if (this.albumMap.has(album.name)) return;

    this.albumMap.set(album.name, album);
    this.addMembers(album);
  }

  addMembers(album: Album) {
    album.tracks
      .flatMap((track) => track.members)
      .forEach((member) => {
        if (this.memberMap.has(member.name)) return;
        this.memberMap.set(member.name, member);
      });
  }
}
