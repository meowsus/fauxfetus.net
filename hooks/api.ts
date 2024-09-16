import { IAudioMetadata } from "music-metadata";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((response) => response.json());

export const useFetchArtists = () =>
  useSWR<App.ArtistsJson>("/data/artists.json", fetcher, {
    fallbackData: [],
  });

export const useFetchArtist = ({ artistSlug }: { artistSlug: string }) =>
  useSWR<App.ArtistJson>(`/data/artists/${artistSlug}.json`, fetcher, {
    fallbackData: { name: "", path: "", albums: [] },
  });

export const useFetchAlbum = ({
  artistSlug,
  albumSlug,
}: {
  artistSlug: string;
  albumSlug: string;
}) =>
  useSWR<App.AlbumJson>(
    `/data/artists/${artistSlug}/${albumSlug}.json`,
    fetcher,
    {
      fallbackData: {
        name: "",
        path: "",
        tracks: [],
        artist: { name: "", path: "" },
      },
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
  useSWR<App.TrackJson>(
    `/data/artists/${artistSlug}/${albumSlug}/${trackSlug}.json`,
    fetcher,
    {
      fallbackData: {
        name: "",
        path: "",
        metadata: {} as IAudioMetadata,
        artist: { name: "", path: "" },
        album: { name: "", path: "" },
      },
    },
  );
