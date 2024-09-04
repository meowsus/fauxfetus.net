import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "fs";
import { join } from "path";
import { parseBuffer } from "music-metadata";
import { readdir, readFile, stat, writeFile } from "fs/promises";

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

  private createDirectoryStructure(fromDir: string, toDir: string) {
    const items = readdirSync(fromDir);

    for (const item of items) {
      const fromPath = join(fromDir, item);
      const toPath = join(toDir, item);

      if (statSync(fromPath).isDirectory()) {
        mkdirSync(toPath, { recursive: true });
        this.createDirectoryStructure(fromPath, toPath);
      }
    }
  }

  deleteToDirectory() {
    console.log(`Deleting ${this.args.toDir}...`);

    rmSync(this.args.toDir, { recursive: true, force: true });
  }

  createToDirectory() {
    console.log(`Creating ${this.args.toDir}...`);

    mkdirSync(this.args.toDir);
  }

  buildToDirectory() {
    console.log(
      `Copying structure of ${this.args.fromDir} to ${this.args.toDir}`,
    );

    this.createDirectoryStructure(this.args.fromDir, this.args.toDir);
  }
}

class Json {
  args: Args;

  constructor(args: Args) {
    if (!existsSync(args.fromDir)) {
      console.error("FROM_DIR does not exist");
      process.exit(2);
    }

    this.args = args;
  }

  private async processMp3File(fromPath: string, toPath: string) {
    const buffer = await readFile(fromPath);

    const fromPathRelative = fromPath.replace(this.args.fromDir, "");
    const toPathRelative = toPath.replace(this.args.toDir, "");

    try {
      console.log(`Try processing from: ${fromPathRelative}...`);

      const metadata = await parseBuffer(buffer, { mimeType: "audio/mpeg" });
      const metadataJson = JSON.stringify(metadata);
      await writeFile(toPath, metadataJson);

      console.log(`Saved metadata to:   ${toPathRelative}...`);
    } catch (error) {
      console.error(error);
      process.exit(3);
    }
  }

  private async scanDirectory(fromDir: string, toDir: string) {
    const items = await readdir(fromDir);

    for (const item of items) {
      const fromPath = join(fromDir, item);
      const toPath = join(toDir, item);

      if ((await stat(fromPath)).isDirectory()) {
        // Recursively process directories
        this.scanDirectory(fromPath, toPath);
      } else if (item.endsWith(".mp3")) {
        // Process MP3 files
        await this.processMp3File(fromPath, toPath.replace(".mp3", ".json"));
      }
    }
  }

  async generateJson() {
    console.log(
      `Scanning ${this.args.fromDir} and generating JSON in ${this.args.toDir}...`,
    );

    await this.scanDirectory(this.args.fromDir, this.args.toDir);
  }
}

(async () => {
  const args = new Args();

  const dir = new Dir(args);
  dir.deleteToDirectory();
  dir.createToDirectory();
  dir.buildToDirectory();

  const json = new Json(args);
  await json.generateJson();
})();
