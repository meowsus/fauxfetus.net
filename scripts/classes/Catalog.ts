import { IAudioMetadata } from "music-metadata";
import Album from "./Album";
import Artist from "./Artist";
import Track from "./Track";

type TracksByAlbumAndArtistName = {
  [artistName: string]: { [albumName: string]: Track[] };
};

export default class Catalog {
  /**
   * Artists
   */
  artists: Artist[];

  constructor(metadataByFilePath: Record<string, IAudioMetadata>) {
    this.artists = this.buildArtists(metadataByFilePath);
  }

  private organizeTracks(tracks: Track[]) {
    return tracks.reduce((prev, track) => {
      const { artistName, albumName } = track;
      if (!prev[artistName]) prev[artistName] = {};
      if (!prev[artistName][albumName]) prev[artistName][albumName] = [];
      prev[artistName][albumName].push(track);
      return prev;
    }, {} as TracksByAlbumAndArtistName);
  }

  private buildArtists(metadataByFilePath: Record<string, IAudioMetadata>) {
    const tracks = Track.wrap(metadataByFilePath);
    const organizedTracks = this.organizeTracks(tracks);

    return Object.entries(organizedTracks).map(([artistName, albumData]) => {
      const artist = new Artist(artistName);

      for (const [albumName, tracks] of Object.entries(albumData)) {
        const album = new Album(albumName, artistName);

        for (const track of tracks) {
          album.addTrack(track);
        }

        artist.addAlbum(album);
      }

      return artist;
    });
  }
}
