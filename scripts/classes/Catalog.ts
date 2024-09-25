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
   * Artists
   */
  artists: Artist[];

  constructor(metadataByFilePath: Record<string, IAudioMetadata>) {
    this.artists = this.buildArtists(metadataByFilePath);
  }

  private sortAlbums(albums: Album[]) {
    return albums.sort((a, b) => a.name.localeCompare(b.name));
  }

  private sortArtists(artists: Artist[]) {
    return artists.sort((a, b) => {
      const nameA = a.name.toLowerCase().replace(/^the\s+/i, "");
      const nameB = b.name.toLowerCase().replace(/^the\s+/i, "");

      return nameA.localeCompare(nameB);
    });
  }

  private sortTracks(tracks: Track[]) {
    return tracks.sort((a, b) => {
      const { no: trackNumberA } = a.metadata.common.track;
      const { no: trackNumberB } = b.metadata.common.track;

      return (trackNumberA || 0) - (trackNumberB || 0);
    });
  }

  private organizeTracksByAlbumAndArtistName(tracks: Track[]) {
    return tracks.reduce((prev, track) => {
      const { artistName, albumName } = track;
      if (!prev[artistName]) prev[artistName] = {};
      if (!prev[artistName][albumName]) prev[artistName][albumName] = [];
      prev[artistName][albumName].push(track);
      return prev;
    }, {} as OrganizedTracks);
  }

  private organizeAlbumsByArtistName(organizedTracks: OrganizedTracks) {
    return Object.entries(organizedTracks).reduce(
      (prev, [artistName, tracksByAlbumName]) => {
        const albums = Album.wrap(tracksByAlbumName, artistName);
        prev[artistName] = this.sortAlbums(albums);
        return prev;
      },
      {} as OrganizedAlbums,
    );
  }

  private buildArtists(metadataByFilePath: Record<string, IAudioMetadata>) {
    const tracks = Track.wrap(metadataByFilePath);
    ``;
    // // TODO: This sorting should happen after organization, ya ding dong
    // const sortedTracks = this.sortTracks(tracks);

    // const tracksByAlbumAndArtistName =
    //   this.organizeTracksByAlbumAndArtistName(sortedTracks);

    // const albumsByArtistName = this.organizeAlbumsByArtistName(
    //   tracksByAlbumAndArtistName,
    // );

    // const artists = Artist.wrap(albumsByArtistName);

    // return this.sortArtists(artists);
  }
}
