import { IAudioMetadata, ICommonTagsResult } from "music-metadata";

declare global {
  namespace App {
    type TrackMetadata = IAudioMetadata;

    type AlbumName = ICommonTagsResult["album"];
    type ArtistName = ICommonTagsResult["artist"];
    type TrackName = ICommonTagsResult["title"];
    type TrackNumber = ICommonTagsResult["track"]["no"];

    interface Artist {
      name: ArtistName;
      path: string;
    }

    interface Album {
      name: AlbumName;
      path: string;
    }

    interface Track {
      name: TrackName;
      path: string;
    }

    type ArtistsJson = Artist[];

    type ArtistJson = Artist & {
      albums: Album[];
    };

    type AlbumJson = Album & {
      tracks: Track[];
      artist: Artist;
    };
  }
}
