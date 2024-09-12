import { existsSync } from "fs";
import { mkdir, readdir, readFile, rm, stat, writeFile } from "fs/promises";
import { IAudioMetadata, parseBuffer } from "music-metadata";
import { join } from "path";
import slugify from "slugify";

const DATA_DIRECTORY = "./public/data";

const USAGE = `
Usage: 

  pnpm run scripts:generate-json FROM_DIR

Arguments:

  FROM_DIR - the parent directory of MP3 catalog
`;

class Args {
  fromDir: string;

  constructor() {
    const fromDir = process.argv[2];

    if (!fromDir) {
      console.error(USAGE);
      process.exit(1);
    }

    this.fromDir = fromDir;
  }
}

type ProcessingWarning = { [path: string]: string[] };

type OrganizedTracks = {
  [artistName: string]: { [albumName: string]: App.TrackMetadata[] };
};

class Json {
  args: Args;

  warnings: ProcessingWarning;

  organizedTracks: OrganizedTracks;

  constructor(args: Args) {
    if (!existsSync(args.fromDir)) {
      console.error("FROM_DIR does not exist");
      process.exit(2);
    }

    this.args = args;
    this.warnings = {};
    this.organizedTracks = {};
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
    trackData: App.TrackMetadata,
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
      `Scanning ${this.args.fromDir} and generating JSON in ${DATA_DIRECTORY}...`,
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

  async prepareDataDirectory() {
    await rm(DATA_DIRECTORY, { recursive: true, force: true });
    await mkdir(DATA_DIRECTORY, { recursive: true });
  }

  async writeArtistsJson() {
    // Get all artist names
    const artistNames = Object.keys(this.organizedTracks);

    // Sort artist names alphabetically, ignoring "The"s
    const sortedArtistNames = artistNames.sort((a, b) => {
      const nameA = a.toLowerCase().replace(/^the\s+/i, "");
      const nameB = b.toLowerCase().replace(/^the\s+/i, "");

      return nameA.localeCompare(nameB);
    });

    // Build the data
    const data: App.ArtistsJson = sortedArtistNames.map((name) => {
      const slug = slugify(name, { strict: true, lower: true });
      const path = `/artists/${slug}`;

      return { name, path };
    });

    // Write the data
    const path = `${DATA_DIRECTORY}/artists.json`;
    const json = JSON.stringify(data);

    await writeFile(path, json);

    // Prep the next directory
    await mkdir(`${DATA_DIRECTORY}/artists`, { recursive: true });
  }

  async writeArtistJson() {
    // For each artist name, take albums...
    Object.entries(this.organizedTracks).forEach(
      async ([artistName, albums]) => {
        // Sort albums alphabetically
        const sortedAlbums = Object.entries(albums).sort((a, b) => {
          const [nameA] = a;
          const [nameB] = b;

          return nameA.localeCompare(nameB);
        });

        // Build the data
        const artistSlug = slugify(artistName, { strict: true, lower: true });

        const data: App.ArtistJson = {
          name: artistName,
          path: `/artists/${artistSlug}`,

          albums: sortedAlbums.map(([albumName]) => {
            const albumSlug = slugify(albumName, { strict: true, lower: true });
            const albumPath = `/artists/${artistSlug}/${albumSlug}`;

            return { name: albumName, path: albumPath };
          }),
        };

        // Write the data
        const path = `${DATA_DIRECTORY}/artists/${artistSlug}.json`;
        const json = JSON.stringify(data);

        await writeFile(path, json);

        // Prep the next directory
        await mkdir(`${DATA_DIRECTORY}/artists/${artistSlug}`, {
          recursive: true,
        });
      },
    );
  }

  async perform() {
    await this.organizeNormalTracks();
    this.printWarnings();
    await this.prepareDataDirectory();
    await this.writeArtistsJson();
    await this.writeArtistJson();
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
