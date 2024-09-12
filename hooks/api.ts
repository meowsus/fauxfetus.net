import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((response) => response.json());

export const useFetchArtists = () =>
  useSWR<App.ArtistsJson>("/data/artists.json", fetcher, {
    fallbackData: [],
  });

export const useFetchArtist = (artist: string) =>
  useSWR<App.ArtistJson>(`/data/artists/${artist}.json`, fetcher, {
    fallbackData: { name: "", path: "", albums: [] },
  });
