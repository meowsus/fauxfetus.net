import { IAudioMetadata } from "music-metadata";

declare global {
  namespace App {
    type TrackMetadata = IAudioMetadata;

    type AlbumName = IAudioMetadata["common"]["album"];
    type ArtistName = IAudioMetadata["common"]["artist"];

    interface Artist {
      name: ArtistName;
      path: string;
    }

    interface Album {
      name: AlbumName;
      path: string;
    }

    type ArtistsJson = Artist[];

    type ArtistJson = Artist & {
      albums: Album[];
    };
  }
}
