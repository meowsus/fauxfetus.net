import { existsSync } from "fs";
import { readdir, readFile, stat } from "fs/promises";
import { IAudioMetadata, parseBuffer } from "music-metadata";
import { join } from "path";

export default class Parser {
  /**
   * The directory from which to process MP3 files
   */
  fromDir: string;

  /**
   * An array of all metadata parsed from `fromDir`
   */
  metadataByFilePath: Record<string, IAudioMetadata>;

  constructor(fromDir: string) {
    // Ensure directory exists
    if (!existsSync(fromDir)) {
      console.error("FROM_DIR does not exist");
      process.exit(2);
    }

    this.fromDir = fromDir;

    this.metadataByFilePath = {};
  }

  /**
   * Responsible for parsing metadata from a file buffer, validating
   * missing artist or album names, before adding them to the tracks object
   */
  private async processMp3File(path: string) {
    // Parse metadata from buffer
    const buffer = await readFile(path);
    const metadata = await parseBuffer(buffer, { mimeType: "audio/mpeg" });

    // Fetch relevant metadata
    const { artist, album } = metadata.common;

    // Process quality warnings as errors
    if (metadata.quality.warnings.length > 0) {
      throw new ProcessingError(
        metadata.quality.warnings.map((warning) => warning.message),
      );
    }

    // Validate presence of artist and album name before adding to tracks
    if (!artist || !album) {
      throw new ProcessingError(`${path}: no artist or album name`);
    } else {
      const key = path.replace(this.fromDir, "");
      this.metadataByFilePath[key] = metadata;
    }
  }

  /**
   * Recursively scans a given directory
   * TODO: move shouldSkip logic out of here so that COMPS and SPLITS can be processed
   */
  async run(startPath: string = this.fromDir) {
    const items = await readdir(startPath);

    for (const item of items) {
      const path = join(startPath, item);

      if (!!path.match(/_RETIRED/)) continue;

      if ((await stat(path)).isDirectory()) {
        // Recursively process directories
        await this.run(path);
      } else if (item.endsWith(".mp3")) {
        // Process MP3 files
        await this.processMp3File(path);
      }
    }
  }
}
