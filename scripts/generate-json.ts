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

type ProcessingWarning = { [path: string]: string[] };

type OrganizedTracks = {
  [artistName: string]: { [albumName: string]: App.TrackMetadata[] };
};

class Json {
  fromDir: string;

  warnings: ProcessingWarning;

  organizedTracks: OrganizedTracks;

  constructor() {
    const fromDir = process.argv[2];

    if (!fromDir) {
      console.error(USAGE);
      process.exit(1);
    }

    if (!existsSync(fromDir)) {
      console.error("FROM_DIR does not exist");
      process.exit(2);
    }

    this.fromDir = fromDir;
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
      `Scanning ${this.fromDir} and generating JSON in ${DATA_DIRECTORY}...`,
    );

    await this.scanDirectory(this.fromDir);
    this.printWarnings();
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

    const json = JSON.stringify(data);

    // Write the data
    const path = `${DATA_DIRECTORY}/artists`;
    await writeFile(`${path}.json`, json);
    await mkdir(path, { recursive: true });
  }

  async writeArtistJson() {
    // For each artist name, take albums...
    for (const [artistName, albums] of Object.entries(this.organizedTracks)) {
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

      const json = JSON.stringify(data);

      // Write the data & prep next directory
      const path = `${DATA_DIRECTORY}/artists/${artistSlug}`;
      await writeFile(`${path}.json`, json);
      await mkdir(path, { recursive: true });
    }
  }

  async writeAlbumJson() {
    // For each artist name, take albums...
    for (const [artistName, albums] of Object.entries(this.organizedTracks)) {
      for (const [albumName, tracks] of Object.entries(albums)) {
        // Sort tracks by track number
        const sortedTracks = tracks.sort((a, b) => {
          const { no: trackNumberA } = a.common.track;
          const { no: trackNumberB } = b.common.track;

          return (trackNumberA || 0) - (trackNumberB || 0);
        });

        // Build the data
        const artistSlug = slugify(artistName, { strict: true, lower: true });
        const artistPath = `/artists/${artistSlug}`;

        const albumSlug = slugify(albumName, { strict: true, lower: true });
        const albumPath = `/artists/${artistSlug}/${albumSlug}`;

        const data: App.AlbumJson = {
          name: albumName,
          path: albumPath,
          artist: { name: artistName, path: artistPath },

          tracks: sortedTracks.map((track) => {
            const name = track.common.title ?? "";
            const slug = slugify(name, { strict: true, lower: true });
            const path = `${albumPath}/${slug}`;

            return { name, path };
          }),
        };

        const json = JSON.stringify(data);

        // Write the data & prep next directory
        const path = `${DATA_DIRECTORY}/artists/${artistSlug}/${albumSlug}`;
        await writeFile(`${path}.json`, json);
        await mkdir(path, { recursive: true });
      }
    }
  }

  async writeTrackJson() {
    // For each artist name, take albums...
    for (const [artistName, albums] of Object.entries(this.organizedTracks)) {
      for (const [albumName, tracks] of Object.entries(albums)) {
        // Build the data
        const artistSlug = slugify(artistName, { strict: true, lower: true });
        const artistPath = `/artists/${artistSlug}`;

        const albumSlug = slugify(albumName, { strict: true, lower: true });
        const albumPath = `/artists/${artistSlug}/${albumSlug}`;

        for (const metadata of tracks) {
          const trackSlug = slugify(metadata.common.title ?? "", {
            strict: true,
            lower: true,
          });

          const path = `/artists/${artistSlug}/${albumSlug}/${trackSlug}`;

          const data: App.TrackJson = {
            name: metadata.common.title,
            album: { name: albumName, path: albumPath },
            artist: { name: artistName, path: artistPath },
            path,
            metadata,
          };

          const json = JSON.stringify(data);

          // Write the data
          await writeFile(`${DATA_DIRECTORY}${path}.json`, json);
        }
      }
    }
  }

  async perform() {
    await this.organizeNormalTracks();
    await this.prepareDataDirectory();
    await this.writeArtistsJson();
    await this.writeArtistJson();
    await this.writeAlbumJson();
    await this.writeTrackJson();
  }
}

async function main() {
  const json = new Json();

  try {
    await json.perform();
  } catch (error) {
    console.error(error);
    process.exit(4);
  }
}

main();
