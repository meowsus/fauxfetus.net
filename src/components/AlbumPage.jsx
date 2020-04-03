import React from 'react';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import CONSTANTS from '../constants';
import { makePlaylistFromAlbumTracks } from '../transformers';

import './Page.css';

import TrackList from './TrackList';

function AlbumPage(props) {
  const { artist, setPlaylist, setTrackIndex, currentFilePath } = props;
  const { artistSlug, albumSlug } = useParams();

  const album = artist.albums[albumSlug];
  const playlist = makePlaylistFromAlbumTracks(
    album.tracks,
    { albumSlug, album: album.name },
    { artistSlug, artist: artist.name },
  );

  const handleAudioControlButtonClick = (trackIndex) => {
    setPlaylist(playlist);
    setTrackIndex(trackIndex);
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
        currentFilePath={currentFilePath}
        onAudioControlButtonClick={handleAudioControlButtonClick}
      />
    </section>
  );
}

AlbumPage.defaultProps = {
  currentFilePath: '',
};

AlbumPage.propTypes = {
  currentFilePath: PropTypes.string,

  setPlaylist: PropTypes.func.isRequired,
  setTrackIndex: PropTypes.func.isRequired,
  artist: CONSTANTS.sharedPropTypes.catalogEntry.isRequired,
};

export default AlbumPage;
