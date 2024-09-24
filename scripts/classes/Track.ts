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
   * The path to the MP3 file
   */
  filePath: string;

  /**
   * The artist's name
   */
  artistName: string;

  /**
   * The artist's slug
   */
  artistSlug: string;

  /**
   * The artist's path
   */
  artistPath: string;

  /**
   * The album name
   */
  albumName: string;

  /**
   * The album slug
   */
  albumSlug: string;

  /**
   * The album path
   */
  albumPath: string;

  /**
   * An array of member names
   */
  members: Member[];

  /**
   * Extracts relevant data from supplied metadata
   */
  constructor(filePath: string, metadata: IAudioMetadata) {
    this.filePath = filePath;
    this.metadata = metadata;

    this.members = Member.wrap(metadata.common.composer ?? []);

    this.artistName = metadata.common.artist ?? "";
    this.artistSlug = Helpers.slugify(this.artistName);
    this.artistPath = `/artists/${this.artistSlug}`;

    this.albumName = metadata.common.album ?? "";
    this.albumSlug = Helpers.slugify(this.albumName);
    this.albumPath = `${this.artistPath}/${this.albumSlug}`;

    this.name = metadata.common.title ?? "";
    this.slug = Helpers.slugify(this.name);

    this.path = `${this.albumPath}/${this.slug}`;
  }

  /**
   * Receives an array of metadata and produces an array of Track instances
   */
  static wrap(metadataByPath: Record<string, IAudioMetadata>) {
    return Object.entries(metadataByPath).map(
      ([path, metadata]) => new Track(path, metadata),
    );
  }
}
