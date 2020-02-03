export function getTracks(data) {
  return (
    Object.values(data).flatMap((artist) => (
      Object.values(artist.albums).flatMap((album) => (
        album.tracks.map((tracks) => ({
          ...tracks,
          artist: artist.name,
          album: album.name,
        }))
      ))
    )).reduce((group, track) => {
      group.push({
        title: track.title,
        artist: track.artist,
        album: track.album,
        filePath: track.filePath,
      });

      return group;
    }, [])
  );
}

export function getArtists(data) {
  return (
    Object.entries(data)
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
