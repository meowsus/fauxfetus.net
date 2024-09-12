"use client";

import { useFetchArtist } from "@/hooks/api";
import Link from "next/link";

interface Props {
  params: { artistSlug: string };
}

export default function ArtistPage({ params }: Props) {
  const { data } = useFetchArtist(params.artistSlug);

  if (!data) throw Error("No data");

  return (
    <>
      <h1>{data.name}</h1>
      <Link href="/artists">Back to artists</Link>
      <h2>Albums</h2>
      <ul>
        {data.albums.map((album) => (
          <li key={album.path}>
            <Link href={album.path}>{album.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
