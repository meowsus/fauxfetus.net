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
        file: track.file,
      });

      return group;
    }, [])
  );
}

export function getArtists() {}
