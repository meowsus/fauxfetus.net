import { existsSync } from "fs";
import { mkdir, readdir, readFile, rm, stat } from "fs/promises";
import { IAudioMetadata, parseBuffer } from "music-metadata";
import { join } from "path";

/**
 * pnpm run scripts:generate-json FROM_DIR TO_DIR
 *
 * Recursively scans the FROM_DIR and creates an identical folder structure
 * in the TO_DIR. The pathname of each MP3 file found in the FROM_DIR will be
 * used to create an identical JSON file in the directory in the TO_DIR containing
 * the metadata for the track.
 *
 * It will then collate all track json files into an album json file in the parent directory.
 * It will then collate all album json files into an artist json file in the parent directory.
 *
 * This process is destructive and will clear the TO_DIR before generation.
 *
 * FROM_DIR:
 * | some_band/
 * |-- some_album/
 * |---- some_track.mp3
 *
 * TO_DIR:
 * | catalog.json
 * | some_band.json
 * | some_band/
 * |-- some_album.json
 * |-- some_album/
 * |---- some_track.json
 */

const USAGE = `
Usage: 

  pnpm run scripts:generate-json FROM_DIR TO_DIR

Arguments:

  FROM_DIR - the parent directory of MP3 catalog
  TO_DIR   - the directory to mimic in JSON files
`;

class Args {
  fromDir: string;

  toDir: string;

  constructor() {
    const fromDir = process.argv[2];
    const toDir = process.argv[3];

    if (!fromDir || !toDir) {
      console.error(USAGE);
      process.exit(1);
    }

    this.fromDir = fromDir;
    this.toDir = toDir;
  }
}

class Dir {
  args: Args;

  constructor(args: Args) {
    if (!existsSync(args.fromDir)) {
      console.error("FROM_DIR does not exist");
      process.exit(2);
    }

    this.args = args;
  }

  // private async createDirectoryStructure(fromDir: string, toDir: string) {
  //   const items = await readdir(fromDir);

  //   for (const item of items) {
  //     const fromPath = join(fromDir, item);
  //     const toPath = join(toDir, item);

  //     const shouldSkip = !!fromPath.match(/_(COMPS|RETIRED|SPLITS)/);

  //     if (shouldSkip) continue;

  //     if ((await stat(fromPath)).isDirectory()) {
  //       await mkdir(toPath, { recursive: true });
  //       await this.createDirectoryStructure(fromPath, toPath);
  //     }
  //   }
  // }

  async deleteToDirectory() {
    console.log(`Deleting ${this.args.toDir}...`);

    await rm(this.args.toDir, { recursive: true, force: true });
  }

  async createToDirectory() {
    console.log(`Creating ${this.args.toDir}...`);

    await mkdir(this.args.toDir);
  }

  // async buildToDirectory() {
  //   console.log(
  //     `Copying structure of ${this.args.fromDir} to ${this.args.toDir}`,
  //   );

  //   await this.createDirectoryStructure(this.args.fromDir, this.args.toDir);
  // }

  async perform() {
    await this.deleteToDirectory();
    await this.createToDirectory();
    // await this.buildToDirectory();
  }
}

class Json {
  args: Args;

  warnings: { [path: string]: string[] };

  organizedTracks: {
    [artistName: string]: { [albumName: string]: App.Track[] };
  };

  constructor(args: Args) {
    if (!existsSync(args.fromDir)) {
      console.error("FROM_DIR does not exist");
      process.exit(2);
    }

    this.args = args;
    this.organizedTracks = {};
    this.warnings = {};
  }

  private addWarning(
    path: string,
    warning: string | IAudioMetadata["quality"]["warnings"],
  ) {
    if (!this.warnings[path]) this.warnings[path] = [];

    if (typeof warning === "string") {
      this.warnings[path].push(warning);
    } else {
      warning.forEach((warning) => this.warnings[path].push(warning.message));
    }
  }

  private addOrganizedTrack(
    artistName: string | undefined,
    albumName: string | undefined,
    trackData: App.Track,
  ) {
    if (!artistName || !albumName) return;

    if (!this.organizedTracks[artistName])
      this.organizedTracks[artistName] = {};

    if (!this.organizedTracks[artistName][albumName])
      this.organizedTracks[artistName][albumName] = [];

    this.organizedTracks[artistName][albumName].push(trackData);
  }

  private async processMp3File(fromPath: string) {
    const buffer = await readFile(fromPath);

    try {
      // console.log(`Try processing from: ${fromPath}...`);

      const trackData = await parseBuffer(buffer, { mimeType: "audio/mpeg" });

      const artistName = trackData.common.artist;
      const albumName = trackData.common.album;

      if (trackData.quality.warnings.length > 0) {
        this.addWarning(fromPath, trackData.quality.warnings);
      }

      if (!artistName || !albumName) {
        this.addWarning(
          fromPath,
          `Artist or album name missing - (Artist: ${artistName}) (Album: ${albumName})`,
        );
      }

      this.addOrganizedTrack(artistName, albumName, trackData);

      // const metadataJson = JSON.stringify(metadata);
      // await writeFile(toPath, metadataJson);

      // console.log(`Saved metadata to:   ${toPathRelative}...`);
    } catch (error) {
      console.error(error);
      process.exit(3);
    }
  }

  private async scanDirectory(fromDir: string) {
    const items = await readdir(fromDir);

    for (const item of items) {
      const fromPath = join(fromDir, item);

      const shouldSkip = !!fromPath.match(/_(COMPS|RETIRED|SPLITS)/);

      if (shouldSkip) continue;

      if ((await stat(fromPath)).isDirectory()) {
        // Recursively process directories
        this.scanDirectory(fromPath);
      } else if (item.endsWith(".mp3")) {
        // Process MP3 files
        await this.processMp3File(fromPath);
      }
    }
  }

  async organizeNormalTracks() {
    console.log(
      `Scanning ${this.args.fromDir} and generating JSON in ${this.args.toDir}...`,
    );

    await this.scanDirectory(this.args.fromDir);
  }

  printWarnings() {
    const entries = Object.entries(this.warnings);

    if (entries.length > 0) {
      console.warn("Problems found: ");

      entries.forEach(([path, warnings]) => {
        console.log(`In ${path}:`);
        warnings.forEach((warning) => {
          console.log(`- ${warning}`);
        });
      });
    }
  }

  async perform() {
    await this.organizeNormalTracks();
    this.printWarnings();
    console.log(Object.entries(this.organizedTracks).length);
    // console.log(this.organizedTracks);
  }
}

(async () => {
  const args = new Args();
  const dir = new Dir(args);
  const json = new Json(args);

  await dir.perform();
  await json.perform();
})();
