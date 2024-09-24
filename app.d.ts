import Album from "./scripts/classes/Album";
import Artist from "./scripts/classes/Artist";
import Track from "./scripts/classes/Track";

declare global {
  namespace App {
    type ArtistsPageData = Pick<typeof Artist, "name" | "path">[];

    type ArtistPageData = Pick<typeof Artist, "name" | "path" | "members"> & {
      albums: Pick<typeof Album, "name" | "path">[];
    };

    type AlbumPageData = Pick<
      typeof Album,
      "name" | "path" | "artistName" | "artistPath" | "members"
    > & {
      tracks: Pick<typeof Track, "name" | "path" | "filePath">[];
    };

    type TrackPageData = typeof Track;
  }
}
