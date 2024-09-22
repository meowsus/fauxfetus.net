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
   * The album's slug
   */
  slug: string;

  /**
   * The album's path
   */
  path: string;

  /**
   * The artist's name
   */
  artistName: string;

  /**
   * The artist's slug
   */
  artistSlug: string;

  /**
   * The album's members
   */
  members: Member[];

  constructor(tracks: Track[], name: string, artistName: string) {
    this.tracks = tracks;

    this.members = this.buildMembers(tracks);

    this.name = name;
    this.slug = Helpers.slugify(name);

    this.artistName = artistName;
    this.artistSlug = Helpers.slugify(artistName);

    this.path = `/artists/${this.artistSlug}/${this.slug}`;
  }

  private buildMembers(tracks: Track[]) {
    const memberSet = new Set<Member>();

    for (const track of tracks) {
      for (const member of track.members) {
        memberSet.add(member);
      }
    }

    return Array.from(memberSet);
  }
}
