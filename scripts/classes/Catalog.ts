import { IAudioMetadata } from "music-metadata";
import Album from "./Album";
import Artist from "./Artist";
import Track from "./Track";

type TracksByAlbumAndArtistName = {
  [artistName: string]: {
    [albumName: string]: {
      [filePath: string]: IAudioMetadata;
    };
  };
};

export default class Catalog {
  /**
   * Artists
   */
  artists: Artist[];

  constructor(metadataByFilePath: Record<string, IAudioMetadata>) {
    this.artists = this.buildArtists(metadataByFilePath);
  }

  private organizeMetadata(metadataByFilePath: Record<string, IAudioMetadata>) {
    return Object.entries(metadataByFilePath).reduce(
      (prev, [filePath, metadata]) => {
        const { artist = "", album = "" } = metadata.common;
        if (!prev[artist]) prev[artist] = {};
        if (!prev[artist][album]) prev[artist][album] = {};
        prev[artist][album][filePath] = metadata;
        return prev;
      },
      {} as TracksByAlbumAndArtistName,
    );
  }

  private buildArtists(metadataByFilePath: Record<string, IAudioMetadata>) {
    const organizedMetadata = this.organizeMetadata(metadataByFilePath);

    return Object.entries(organizedMetadata).map(([artistName, albumData]) => {
      const artist = new Artist(artistName);

      for (const [albumName, trackData] of Object.entries(albumData)) {
        const album = new Album(albumName, artistName);

        for (const [filePath, metadata] of Object.entries(trackData)) {
          const track = new Track(filePath, metadata);

          album.addTrack(track);
        }

        artist.addAlbum(album);
      }

      return artist;
    });
  }
}
