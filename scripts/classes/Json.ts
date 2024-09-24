import { mkdir, writeFile } from "fs/promises";
import { DATA_DIRECTORY } from "../constants";
import Artist from "./Artist";

export class Json {
  /**
   * Artists
   */
  artists: Artist[];

  constructor(artists: Artist[]) {
    this.artists = artists;
  }

  async write(path: string, data: any) {
    const dir = path.substring(0, path.lastIndexOf("/"));
    await mkdir(`${DATA_DIRECTORY}/${dir}`, { recursive: true });
    await writeFile(`${DATA_DIRECTORY}/${path}`, JSON.stringify(data));
  }

  async writeArtistsPageData() {
    const data: App.ArtistsPageData = this.artists.map((artist) => {
      const { name, path } = artist;
      return { name, path };
    });

    await this.write("/artists.json", data);
  }

  async writeArtistPageData() {
    for (const artist of this.artists) {
      const { name, path, members } = artist;

      const albums = artist.albums.map((album) => {
        const { name, path } = album;
        return { name, path };
      });

      const data: App.ArtistPageData = { name, path, members, albums };

      await this.write(`${artist.path}.json`, data);
    }
  }

  async writeAlbumPageData() {
    const albums = this.artists.flatMap((artist) => artist.albums);

    for (const album of albums) {
      const { name, path, artistName, artistPath, members } = album;

      const tracks = album.tracks.map((track) => {
        const { name, path, filePath } = track;
        return { name, path, filePath };
      });

      const data: App.AlbumPageData = {
        name,
        path,
        artistName,
        artistPath,
        members,
        tracks,
      };

      await this.write(`${album.path}.json`, data);
    }
  }

  async writeTrackPageData() {
    const tracks = this.artists
      .flatMap((artist) => artist.albums)
      .flatMap((album) => album.tracks);

    for (const track of tracks) {
      await this.write(`${track.path}.json`, track);
    }
  }
}
