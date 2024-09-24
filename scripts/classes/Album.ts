import Helpers from "./Helpers";
import Member from "./Member";
import Track from "./Track";

export default class Album {
  /**
   * The album's tracks
   */
  tracks: Track[];

  /**
   * The album's name
   */
  name: string;

  /**
   * The album's path
   */
  path: string;

  /**
   * The artist's name
   */
  artistName: string;

  /**
   * Artist Path
   */
  artistPath: string;

  /**
   * The album's members
   */
  members: Member[];

  constructor(tracks: Track[], name: string, artistName: string) {
    this.name = name;
    this.tracks = tracks;
    this.artistName = artistName;

    this.artistPath = `/artists/${Helpers.slugify(artistName)}`;
    this.path = `${this.artistPath}/${Helpers.slugify(name)}`;

    this.members = this.buildMembers(tracks);
  }

  static wrap(tracksByAlbumName: Record<string, Track[]>, artistName: string) {
    return Object.entries(tracksByAlbumName).map(
      ([albumName, tracks]) => new Album(tracks, albumName, artistName),
    );
  }

  private buildMembers(tracks: Track[]) {
    return Array.from(
      tracks
        .flatMap((track) => track.members)
        .reduce((map, member) => {
          if (!map.has(member.name)) map.set(member.name, member);
          return map;
        }, new Map<string, Member>())
        .values(),
    );
  }
}
