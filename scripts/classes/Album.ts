import Helpers from "./Helpers";
import Member from "./Member";
import Track from "./Track";

export default class Album {
  /**
   * A map of the album's tracks, keyed by file path
   */
  trackMap: Map<string, Track>;

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
   * A map of the album's members, keyed by member name
   */
  memberMap: Map<string, Member>;

  constructor(name: string, artistName: string) {
    this.name = name;
    this.artistName = artistName;

    this.artistPath = `/artists/${Helpers.slugify(artistName)}`;
    this.path = `${this.artistPath}/${Helpers.slugify(name)}`;

    this.trackMap = new Map();
    this.memberMap = new Map();
  }

  addTrack(track: Track) {
    if (this.trackMap.has(track.filePath)) return;

    this.trackMap.set(track.filePath, track);
    this.addMembers(track);
  }

  private addMembers(track: Track) {
    track.members.forEach((member) => {
      if (this.memberMap.has(member.name)) return;
      this.memberMap.set(member.name, member);
    });
  }

  get members() {
    return Array.from(this.memberMap.values());
  }

  get tracks() {
    return Array.from(this.trackMap.values()).sort((a, b) => {
      return a.trackNumber - b.trackNumber;
    });
  }
}
