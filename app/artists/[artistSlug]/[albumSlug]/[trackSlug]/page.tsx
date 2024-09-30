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
      <Link href={data.albumPath}>Back to {data.albumName}</Link>
      <Link href={data.artistPath}>Back to {data.artistName}</Link>
      <h2>Metadata</h2>
      <pre className="ml-6">{JSON.stringify(data.metadata)}</pre>
    </>
  );
}
