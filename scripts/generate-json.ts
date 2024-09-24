import { existsSync } from "fs";
import { mkdir, rm, writeFile } from "fs/promises";
import slugify from "slugify";
import Catalog from "./classes/Catalog";
import Parser from "./classes/Parser";

const DATA_DIRECTORY = "./public/data";

const USAGE = `
Usage: 

  pnpm run scripts:generate-json FROM_DIR

Arguments:

  FROM_DIR - the parent directory of MP3 catalog
`;

type ProcessingError = { [path: string]: string[] };

type OrganizedTracks = {
  [artistName: string]: { [albumName: string]: App.TrackMetadata[] };
};

/**
 * Responsible for processing, validating, and creating a ton of JSON files
 * in the public directory
 */
class Json {
  /**
   * The directory from which to process MP3 files
   */
  fromDir: string;

  /**
   * An object of path keys and string arrays
   */
  errors: ProcessingError;

  /**
   * An object of track metadata organized by artist name and album name
   */
  tracks: OrganizedTracks;

  /**
   * Setup
   */
  constructor() {
    const fromDir = process.argv[2];

    // Ensure directory was supplied
    if (!fromDir) {
      console.error(USAGE);
      process.exit(1);
    }

    // Ensure directory exists
    if (!existsSync(fromDir)) {
      console.error("FROM_DIR does not exist");
      process.exit(2);
    }

    this.fromDir = fromDir;
    this.errors = {};
    this.tracks = {};
  }

  /**
   * Utility to push a track into the organized track object.
   */
  private addTrack(
    artistName: string,
    albumName: string,
    metadata: App.TrackMetadata,
  ) {
    // Make space for the artist
    if (!this.tracks[artistName]) this.tracks[artistName] = {};

    // Make space for the album
    if (!this.tracks[artistName][albumName])
      this.tracks[artistName][albumName] = [];

    // Add the metadata to the artist's album
    this.tracks[artistName][albumName].push(metadata);
  }

  /**
   * Utility for consistent slugs
   */
  private slugify(name: string) {
    return slugify(name, { strict: true, lower: true });
  }

  /**
   * Prints validation warnings and exists
   * TODO: Expand to iterate over tracks for more specific validation
   */
  private validateTracks() {
    const entries = Object.entries(this.errors);

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

  /**
   * Main track processor
   * TODO: processing normal tracks and split tracks are different operations?
   */
  async processTracks() {
    console.log(
      `Scanning ${this.fromDir} and generating JSON in ${DATA_DIRECTORY}...`,
    );

    await this.scanDirectory(this.fromDir);
  }

  /**
   * Blows out the DATA_DIRECTORY and recreates it
   */
  async prepareDataDirectory() {
    await rm(DATA_DIRECTORY, { recursive: true, force: true });
    await mkdir(DATA_DIRECTORY, { recursive: true });
  }

  /**
   * Writes the artist index json
   */
  async writeArtistsJson() {
    // Get all artist names
    const artistNames = Object.keys(this.tracks);

    // Sort artist names alphabetically, ignoring "The"s
    const sortedArtistNames = artistNames.sort((a, b) => {
      const nameA = a.toLowerCase().replace(/^the\s+/i, "");
      const nameB = b.toLowerCase().replace(/^the\s+/i, "");

      return nameA.localeCompare(nameB);
    });

    // Build the data
    const data: App.ArtistsJson = sortedArtistNames.map((name) => {
      const slug = this.slugify(name);
      const path = `/artists/${slug}`;

      return { name, path };
    });

    const json = JSON.stringify(data);

    // Write the data
    const path = `${DATA_DIRECTORY}/artists`;
    await writeFile(`${path}.json`, json);
    await mkdir(path, { recursive: true });
  }

  /**
   * Writes an artist's data
   */
  async writeArtistJson() {
    // For each artist name, take albums...
    for (const [artistName, albums] of Object.entries(this.tracks)) {
      // Sort albums alphabetically
      const sortedAlbums = Object.entries(albums).sort((a, b) => {
        const [nameA] = a;
        const [nameB] = b;

        return nameA.localeCompare(nameB);
      });

      // Build the data
      const artistSlug = this.slugify(artistName);

      const data: App.ArtistJson = {
        name: artistName,
        path: `/artists/${artistSlug}`,

        albums: sortedAlbums.map(([albumName]) => {
          const albumSlug = this.slugify(albumName);
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

  /**
   * Writes an artist's album data
   */
  async writeAlbumJson() {
    // For each artist name, take albums...
    for (const [artistName, albums] of Object.entries(this.tracks)) {
      for (const [albumName, tracks] of Object.entries(albums)) {
        // Sort tracks by track number
        const sortedTracks = tracks.sort((a, b) => {
          const { no: trackNumberA } = a.common.track;
          const { no: trackNumberB } = b.common.track;

          return (trackNumberA || 0) - (trackNumberB || 0);
        });

        // Build the data
        const artistSlug = this.slugify(artistName);
        const artistPath = `/artists/${artistSlug}`;

        const albumSlug = this.slugify(albumName);
        const albumPath = `/artists/${artistSlug}/${albumSlug}`;

        const data: App.AlbumJson = {
          name: albumName,
          path: albumPath,
          artist: { name: artistName, path: artistPath },

          tracks: sortedTracks.map((track) => {
            const name = track.common.title ?? "";
            const slug = this.slugify(name);
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

  /**
   * Write's an artist's album's track data
   */
  async writeTrackJson() {
    // For each artist name, take albums...
    for (const [artistName, albums] of Object.entries(this.tracks)) {
      for (const [albumName, tracks] of Object.entries(albums)) {
        // Build the data
        const artistSlug = this.slugify(artistName);
        const artistPath = `/artists/${artistSlug}`;

        const albumSlug = this.slugify(albumName);
        const albumPath = `/artists/${artistSlug}/${albumSlug}`;

        for (const metadata of tracks) {
          const trackSlug = this.slugify(metadata.common.title ?? "");

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
    await this.processTracks();
    this.validateTracks();
    await this.prepareDataDirectory();
    await this.writeArtistsJson();
    await this.writeArtistJson();
    await this.writeAlbumJson();
    await this.writeTrackJson();
  }
}

async function main() {
  const fromDir = process.argv[2];

  // Ensure directory was supplied
  if (!fromDir) {
    console.error(USAGE);
    process.exit(1);
  }

  try {
    const parser = new Parser(fromDir);
    await parser.run();
    const catalog = new Catalog(parser.metadataByPath);
    console.log(catalog.artists[11].albums[0].tracks[0].filePath);
    console.log(JSON.stringify(catalog.artists[11]));
  } catch (error) {
    console.error(error);
    process.exit(2);
  }
}

main();
