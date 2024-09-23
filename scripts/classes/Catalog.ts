import { IAudioMetadata } from "music-metadata";
import Album from "./Album";
import Artist from "./Artist";
import Track from "./Track";

type OrganizedTracks = {
  [artistName: string]: { [albumName: string]: Track[] };
};

type OrganizedAlbums = {
  [artistName: string]: Album[];
};

export default class Catalog {
  /**
   * Tracks
   */
  tracks: Track[];

  /**
   * Tracks organized by Artist & Album Name
   */
  organizedTracks: OrganizedTracks;

  /**
   * Albums organized by Artist Name
   */
  organizedAlbums: OrganizedAlbums;

  /**
   * Artists
   */
  artists: Artist[];

  constructor(metadata: IAudioMetadata[]) {
    this.tracks = Track.wrap(metadata);
    this.organizedTracks = this.organizeTracks(this.tracks);
    this.organizedAlbums = this.organizeAlbums(this.organizedTracks);
    this.artists = this.buildArtists(this.organizedAlbums);
  }

  private organizeTracks(tracks: Track[]) {
    return tracks.reduce((prev, track) => {
      const { artistName, albumName } = track;
      if (!prev[artistName]) prev[artistName] = {};
      if (!prev[artistName][albumName]) prev[artistName][albumName] = [];
      prev[artistName][albumName].push(track);
      return prev;
    }, {} as OrganizedTracks);
  }

  private organizeAlbums(organizedTracks: OrganizedTracks) {
    return Object.entries(organizedTracks).reduce(
      (prev, [artistName, tracksByAlbum]) => {
        const albums = Object.entries(tracksByAlbum).map(
          ([albumName, tracks]) => new Album(tracks, albumName, artistName),
        );
        prev[artistName] = albums;
        return prev;
      },
      {} as OrganizedAlbums,
    );
  }

  private buildArtists(organizedAlbums: OrganizedAlbums) {
    return Object.entries(organizedAlbums).map(
      ([artistName, albums]) => new Artist(albums, artistName),
    );
  }
}
