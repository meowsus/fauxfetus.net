import { IAudioMetadata } from "music-metadata";

declare global {
  namespace App {
    type Track = IAudioMetadata;

    type AlbumName = IAudioMetadata["common"]["album"];
    type ArtistName = IAudioMetadata["common"]["artist"];

    interface Album {
      tracks: Track[];
      name: AlbumName;
    }

    interface Artist {
      albums: Album[];
      name: ArtistName;
    }
  }
}
