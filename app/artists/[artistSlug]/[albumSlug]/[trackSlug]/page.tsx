"use client";

import { useFetchTrack } from "@/hooks/api";
import { Link } from "@nextui-org/link";

interface Props {
  params: { artistSlug: string; albumSlug: string; trackSlug: string };
}

export default function AlbumPage({ params }: Props) {
  const { data } = useFetchTrack(params);

  if (!data) throw Error("No data");

  return (
    <>
      <h1>{data.name}</h1>
      <Link href={data.album.path}>Back to {data.album.name}</Link>
      <Link href={data.artist.path}>Back to {data.artist.name}</Link>
      <h2>Metadata</h2>
      <pre className="ml-6">{JSON.stringify(data.metadata)}</pre>
    </>
  );
}
