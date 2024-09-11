"use client";

import { useFetchArtists } from "@/hooks/api";
import Link from "next/link";

export default function ArtistsPage() {
  const { data } = useFetchArtists();

  if (!data) throw Error("No data");

  return (
    <>
      <h1>Artists</h1>
      {data.map((artist) => (
        <Link href={artist.url} key={artist.url}>
          {artist.name}
        </Link>
      ))}
    </>
  );
}
