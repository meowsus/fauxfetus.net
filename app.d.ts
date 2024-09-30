import Album from "./scripts/classes/Album";
import Artist from "./scripts/classes/Artist";
import Track from "./scripts/classes/Track";

declare global {
  namespace App {
    type ArtistsPageData = Pick<Artist, "name" | "path">[];

    type ArtistPageData = Pick<Artist, "name" | "path" | "members"> & {
      albums: Pick<Album, "name" | "path">[];
    };

    type AlbumPageData = Pick<
      Album,
      "name" | "path" | "artistName" | "artistPath" | "members"
    > & {
      tracks: Pick<Track, "name" | "path" | "filePath">[];
    };

    type TrackPageData = Track;
  }
}
