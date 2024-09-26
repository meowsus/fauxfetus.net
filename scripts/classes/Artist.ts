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
   * An array of member names, keyed by member name
   */
  memberMap: Map<string, Member>;

  /**
   * The artist's albums, keyed by album name
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

  get albums() {
    return Array.from(this.albumMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }

  addAlbum(album: Album) {
    if (this.albumMap.has(album.name)) return;

    this.albumMap.set(album.name, album);
    this.addMembers(album);
  }

  private addMembers(album: Album) {
    album.tracks
      .flatMap((track) => track.members)
      .forEach((member) => {
        if (this.memberMap.has(member.name)) return;
        this.memberMap.set(member.name, member);
      });
  }
}
