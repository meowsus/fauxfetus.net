import React from 'react';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import CONSTANTS from '../../constants';
import { makePlaylistFromAlbumTracks } from '../../transformers';

import '../Page.css';

import TrackList from '../TrackList';

function AlbumPage(props) {
  const { artist, setPlaylist } = props;
  const { artistSlug, albumSlug } = useParams();

  const album = artist.albums[albumSlug];
  const playlist = makePlaylistFromAlbumTracks(
    album.tracks,
    { albumSlug, album: album.name },
    { artistSlug, artist: artist.name },
  );

  const handleAudioControlButtonClick = (trackNumber) => {
    setPlaylist(playlist);
  };

  return (
    <section className="AlbumPage">
      <div className="Page-head">
        <h1>
          <Link to={`/artist/${artistSlug}`}>
            {artist.name}
          </Link>
        </h1>
        <h2>{album.name}</h2>
      </div>

      <TrackList
        tracks={album.tracks}
        onAudioControlButtonClick={handleAudioControlButtonClick}
      />
    </section>
  );
}

AlbumPage.propTypes = {
  setPlaylist: PropTypes.func.isRequired,
  artist: CONSTANTS.sharedPropTypes.catalogEntry.isRequired,
};

export default AlbumPage;
