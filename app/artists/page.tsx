import Link from "next/link";
import ArtistsData from "../../public/data/artists.json";

export default function ArtistsPage() {
  const artists: App.Artist[] = ArtistsData;

  return (
    <>
      <h1>Artists</h1>
      {artists.map((artist) => (
        <Link href={artist.url} key={artist.url}>
          {artist.name}
        </Link>
      ))}
    </>
  );
}
