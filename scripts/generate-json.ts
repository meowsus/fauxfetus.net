import { mkdir, rm } from "fs/promises";
import Catalog from "./classes/Catalog";
import { Json } from "./classes/Json";
import Parser from "./classes/Parser";
import { DATA_DIRECTORY } from "./constants";

const USAGE = `
Usage: 

  pnpm run scripts:generate-json FROM_DIR

Arguments:

  FROM_DIR - the parent directory of MP3 catalog
`;

(async () => {
  const fromDir = process.argv[2];

  // Ensure directory was supplied
  if (!fromDir) {
    console.error(USAGE);
    process.exit(1);
  }

  try {
    await rm(DATA_DIRECTORY, { recursive: true, force: true });
    await mkdir(DATA_DIRECTORY, { recursive: true });

    const parser = new Parser(fromDir);

    await parser.run();

    const catalog = new Catalog(parser.metadataByFilePath);
    const json = new Json(catalog.artists);

    json.writeArtistsPageData();
    json.writeArtistPageData();
    json.writeAlbumPageData();
    json.writeTrackPageData();
  } catch (error) {
    console.error(error);
    process.exit(2);
  }
})();
