import { IAudioMetadata } from "music-metadata";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((response) => response.json());

export const useFetchArtists = () =>
  useSWR<App.ArtistsPageData>("/json/artists.json", fetcher, {
    fallbackData: [],
  });

export const useFetchArtist = ({ artistSlug }: { artistSlug: string }) =>
  useSWR<App.ArtistPageData>(`/json/artists/${artistSlug}.json`, fetcher, {
    fallbackData: { name: "", path: "", members: [], albums: [] },
  });

export const useFetchAlbum = ({
  artistSlug,
  albumSlug,
}: {
  artistSlug: string;
  albumSlug: string;
}) =>
  useSWR<App.AlbumPageData>(
    `/json/artists/${artistSlug}/${albumSlug}.json`,
    fetcher,
    {
      fallbackData: {
        name: "",
        path: "",
        artistName: "",
        artistPath: "",
        members: [],
        tracks: [],
      } as App.AlbumPageData,
    },
  );

export const useFetchTrack = ({
  artistSlug,
  albumSlug,
  trackSlug,
}: {
  artistSlug: string;
  albumSlug: string;
  trackSlug: string;
}) =>
  useSWR<App.TrackPageData>(
    `/json/artists/${artistSlug}/${albumSlug}/${trackSlug}.json`,
    fetcher,
    {
      fallbackData: {
        metadata: {} as IAudioMetadata,
        name: "",
        path: "",
        filePath: "",
        artistName: "",
        artistPath: "",
        albumName: "",
        albumPath: "",
        members: [],
        trackNumber: 0,
      },
    },
  );
