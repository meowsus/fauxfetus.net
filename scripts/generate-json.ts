import { existsSync } from "fs";
import { readdir, readFile, stat } from "fs/promises";
import { IAudioMetadata, parseBuffer } from "music-metadata";
import { join } from "path";

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

class Json {
  args: Args;

  warnings: { [path: string]: string[] };

  tracksByArtistAndAlbum: {
    [artistName: string]: { [albumName: string]: App.Track[] };
  };

  constructor(args: Args) {
    if (!existsSync(args.fromDir)) {
      console.error("FROM_DIR does not exist");
      process.exit(2);
    }

    this.args = args;
    this.warnings = {};
    this.tracksByArtistAndAlbum = {};
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

    if (!this.tracksByArtistAndAlbum[artistName])
      this.tracksByArtistAndAlbum[artistName] = {};

    if (!this.tracksByArtistAndAlbum[artistName][albumName])
      this.tracksByArtistAndAlbum[artistName][albumName] = [];

    this.tracksByArtistAndAlbum[artistName][albumName].push(trackData);
  }

  private async processMp3File(fromPath: string) {
    const buffer = await readFile(fromPath);

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
  }

  private async scanDirectory(fromDir: string) {
    const items = await readdir(fromDir);

    for (const item of items) {
      const fromPath = join(fromDir, item);

      const shouldSkip = !!fromPath.match(/_(COMPS|RETIRED|SPLITS)/);

      if (shouldSkip) continue;

      if ((await stat(fromPath)).isDirectory()) {
        // Recursively process directories
        await this.scanDirectory(fromPath);
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

    if (entries.length === 0) return;

    console.warn("Problems found: ");

    entries.forEach(([path, warnings]) => {
      console.log(`In ${path}:`);
      warnings.forEach((warning) => {
        console.log(`- ${warning}`);
      });
    });

    process.exit(3);
  }

  async perform() {
    await this.organizeNormalTracks();
    this.printWarnings();
  }
}

async function main() {
  const args = new Args();
  const json = new Json(args);

  try {
    await json.perform();
  } catch (error) {
    console.error(error);
    process.exit(4);
  }
}

main();
