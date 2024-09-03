import { existsSync, rmSync } from "fs";

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

    if (!existsSync(args.toDir)) {
      console.error("TO_DIR does not exist");
      process.exit(2);
    }

    this.args = args;
  }

  deleteToDirectory() {
    rmSync(this.args.toDir, { recursive: true, force: true });
  }
}

(() => {
  const args = new Args();

  const dir = new Dir(args);
  dir.deleteToDirectory();
})();
