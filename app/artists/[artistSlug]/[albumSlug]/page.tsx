"use client";

import { useFetchAlbum } from "@/hooks/api";
import { Link } from "@nextui-org/link";

interface Props {
  params: { artistSlug: string; albumSlug: string };
}

export default function AlbumPage({ params }: Props) {
  const { data } = useFetchAlbum(params);

  if (!data) throw Error("No data");

  return (
    <>
      <h1>{data.name}</h1>
      <Link href={data.artistPath}>Back to {data.artistName}</Link>
      <h2>Tracks</h2>
      <ol className="ml-6">
        {data.tracks.map((track) => (
          <li key={track.path} className="list-decimal">
            <Link href={track.path}>{track.name}</Link>
          </li>
        ))}
      </ol>
    </>
  );
}
