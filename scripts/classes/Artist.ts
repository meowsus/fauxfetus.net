import Album from "./Album";
import Helpers from "./Helpers";
import Member from "./Member";

export default class Artist {
  /**
   * The artist's name
   */
  name: string;

  /**
   * The artist's slug
   */
  slug: string;

  /**
   * The artist's path
   */
  path: string;

  /**
   * The artist's members
   */
  members: Member[];

  /**
   * The artist's albums
   */
  albums: Album[];

  constructor(albums: Album[], name: string) {
    this.albums = albums;

    this.members = this.buildMembers(albums);

    this.name = name;
    this.slug = Helpers.slugify(name);

    this.path = `/artists/${this.slug}`;
  }

  private buildMembers(albums: Album[]) {
    return Array.from(
      albums
        .flatMap((album) => album.tracks)
        .flatMap((track) => track.members)
        .reduce((map, member) => {
          if (!map.has(member.name)) map.set(member.name, member);
          return map;
        }, new Map<string, Member>())
        .values(),
    );
  }
}
