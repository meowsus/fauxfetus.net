import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((response) => response.json());

export const useFetchArtists = () =>
  useSWR<App.Artist[]>("/data/artists.json", fetcher, {
    fallbackData: [],
  });
