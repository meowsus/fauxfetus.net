"use client";

import { useFetchArtists } from "@/hooks/api";
import Link from "next/link";

export default function ArtistsPage() {
  const { data } = useFetchArtists();

  if (!data) throw Error("No data");

  return (
    <>
      <h1>Artists</h1>
      <ul>
        {data.map((artist) => (
          <li key={artist.path}>
            <Link href={artist.path}>{artist.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
