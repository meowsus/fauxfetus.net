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
