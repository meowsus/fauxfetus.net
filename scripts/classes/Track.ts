import { IAudioMetadata } from "music-metadata";
import Helpers from "./Helpers";

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
  members: string[];

  /**
   * Extracts relevant data from supplied metadata
   */
  constructor(metadata: IAudioMetadata) {
    this.metadata = metadata;

    this.members = this.metadata.common.composer ?? [];

    this.artistName = this.metadata.common.artist ?? "";
    this.artistSlug = Helpers.slugify(this.artistName);

    this.albumName = this.metadata.common.album ?? "";
    this.albumSlug = Helpers.slugify(this.albumName);

    this.name = this.metadata.common.title ?? "";
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
