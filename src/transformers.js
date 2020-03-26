export function makePlaylistFromAlbumTracks(tracks, albumData, artistData) {
  return (
    tracks.map((track) => ({
      ...track,
      ...albumData,
      ...artistData,
    }))
  );
}

export function makePlaylistFromCatalog(catalog) {
  return (
    Object.entries(catalog).flatMap(([artistSlug, artist]) => (
      Object.entries(artist.albums).flatMap(([albumSlug, album]) => (
        makePlaylistFromAlbumTracks(
          album.tracks,
          { albumSlug, album: album.name },
          { artistSlug, artist: artist.name },
        )
      ))
    ))
  );
}

export function makeArtistsFromCatalog(catalog) {
  return (
    Object
      .entries(catalog)
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

export function makeAlbumsFromArtist(artist) {
  return (
    Object
      .entries(artist.albums)
      .map(([k, v]) => ({ ...v, slug: k }))
  );
}

// TODO this doesn't seem necessary. Smash into scraper script?
export function makePlaylistTrackFromPlaylist(playlist, index) {
  const { filePath } = playlist[index];
  const fileUrl = filePath.replace(/^public/, process.env.PUBLIC_URL);

  return {
    ...playlist[index],
    index,
    fileUrl,
  };
}
