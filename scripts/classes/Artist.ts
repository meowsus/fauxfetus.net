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
  members: Member[];

  /**
   * The artist's albums
   */
  albums: Album[];

  constructor(albums: Album[], name: string) {
    this.name = name;
    this.albums = albums;

    this.path = `/artists/${Helpers.slugify(name)}`;

    this.members = this.buildMembers(albums);
  }

  static wrap(albumsByArtistName: Record<string, Album[]>) {
    return Object.entries(albumsByArtistName).map(
      ([artistName, albums]) => new Artist(albums, artistName),
    );
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
