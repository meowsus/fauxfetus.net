export function getTracks(data) {
  return (
    Object.entries(data).flatMap(([artistSlug, artist]) => (
      Object.entries(artist.albums).flatMap(([albumSlug, album]) => (
        album.tracks.map((tracks) => ({
          ...tracks,
          albumSlug,
          artistSlug,
          album: album.name,
          artist: artist.name,
        }))
      ))
    ))
  );
}

export function getArtists(data) {
  return (
    Object
      .entries(data)
      .reduce((group, [slug, artist]) => {
        group.push({
          slug,
          name: artist.name,
        });

        return group;
      }, [])
      .sort((a, b) => (
        (a.slug < b.slug) ? -1 : 1
      ))
  );
}
