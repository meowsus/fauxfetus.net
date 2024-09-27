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
   * The artist's path
   */
  artistPath: string;

  /**
   * The album name
   */
  albumName: string;

  /**
   * The album path
   */
  albumPath: string;

  /**
   * An array of member names
   */
  members: Member[];

  /**
   * Track number
   */
  trackNumber: number;

  /**
   * Extracts relevant data from supplied metadata
   */
  constructor(filePath: string, metadata: IAudioMetadata) {
    this.filePath = filePath;
    this.metadata = metadata;

    this.artistName = metadata.common.artist ?? "";
    this.albumName = metadata.common.album ?? "";
    this.name = metadata.common.title ?? "";
    this.trackNumber = metadata.common.track.no || 0;

    this.artistPath = `/artists/${Helpers.slugify(this.artistName)}`;
    this.albumPath = `${this.artistPath}/${Helpers.slugify(this.albumName)}`;
    this.path = `${this.albumPath}/${Helpers.slugify(this.name)}`;

    this.members = Member.wrap(metadata.common.composer ?? []);
  }
}
