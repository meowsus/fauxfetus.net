import { IAudioMetadata } from "music-metadata";
import Helpers from "./Helpers";
import Member from "./Member";

export default class Track {
  /**
   * The parsed metadata for the track
   */
  metadata: IAudioMetadata;

  /**
   * The track's name
   */
  name: string;

  /**
   * The track's slug
   */
  slug: string;

  /**
   * The track's router path
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
   * The album name
   */
  albumName: string;

  /**
   * The album slug
   */
  albumSlug: string;

  /**
   * An array of member names
   */
  members: Member[];

  /**
   * Extracts relevant data from supplied metadata
   */
  constructor(metadata: IAudioMetadata) {
    this.metadata = metadata;

    this.members = Member.wrap(metadata.common.composer ?? []);

    this.artistName = metadata.common.artist ?? "";
    this.artistSlug = Helpers.slugify(this.artistName);

    this.albumName = metadata.common.album ?? "";
    this.albumSlug = Helpers.slugify(this.albumName);

    this.name = metadata.common.title ?? "";
    this.slug = Helpers.slugify(this.name);

    this.path = `/artists/${this.artistSlug}/${this.albumSlug}/${this.slug}`;
  }

  /**
   * Receives an array of metadata and produces an array of Track instances
   */
  static wrap(data: IAudioMetadata[]) {
    return data.map((metadata) => new Track(metadata));
  }
}
