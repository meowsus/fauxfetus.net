import { IAudioMetadata } from "music-metadata";

declare global {
  namespace App {
    type TrackMetadata = IAudioMetadata;

    type AlbumName = IAudioMetadata["common"]["album"];
    type ArtistName = IAudioMetadata["common"]["artist"];

    interface Artist {
      name: ArtistName;
      url: string;
    }

    interface Album {
      name: AlbumName;
      url: string;
      artistName: ArtistName;
      artistUrl: string;
    }
  }
}
