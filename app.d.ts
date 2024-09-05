import { IAudioMetadata } from "music-metadata";

declare global {
  namespace App {
    type Track = IAudioMetadata;

    interface Album {
      tracks: Track[];
    }

    interface Artist {
      albums: Album[];
    }
  }
}
