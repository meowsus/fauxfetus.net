import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import isEmpty from 'lodash.isempty';

import './AudioPlayer.css';

import AudioPlayerButton from './AudioPlayerButton';

function AudioPlayer(props) {
  const {
    playlist,
    isPlaying,
    currentTrack,
    onPlayButtonClick,
    onChangeTrackButtonClick,
    onShuffleCatalogButtonClick,
  } = props;

  const {
    album,
    title,
    artist,
    albumSlug,
    artistSlug,
  } = currentTrack || {};

  return (
    <div className="AudioPlayer">
      <div className="AudioPlayer-layout">
        <AudioPlayerButton
          type="shuffleCatalog"
          onClick={onShuffleCatalogButtonClick}
        />

        <AudioPlayerButton
          type="play"
          isPlaying={isPlaying}
          onClick={() => onPlayButtonClick(playlist)}
        />

        <div className="AudioPlayer-display">
          <strong className="AudioPlayer-title">
            {isEmpty(currentTrack) ? 'Press Play to start Radio' : title}
          </strong>
          {!isEmpty(currentTrack) && (
            <span className="AudioPlayer-info">
              <span>from</span>
              <Link to={`/artist/${artistSlug}/${albumSlug}`}>{album}</Link>
              <span>by</span>
              <Link to={`/artist/${artistSlug}`}>{artist}</Link>
            </span>
          )}
        </div>

        <AudioPlayerButton
          type="previous"
          onClick={() => onChangeTrackButtonClick('previous')}
        />

        <AudioPlayerButton
          type="next"
          onClick={() => onChangeTrackButtonClick('next')}
        />
      </div>
    </div>
  );
}

AudioPlayer.propTypes = {
  playlist: PropTypes.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  onPlayButtonClick: PropTypes.func.isRequired,
  onChangeTrackButtonClick: PropTypes.func.isRequired,
  onShuffleCatalogButtonClick: PropTypes.func.isRequired,
  currentTrack: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    filePath: PropTypes.string.isRequired,
    extra: PropTypes.shape({
      bitrate: PropTypes.number.isRequired,
      duration: PropTypes.number.isRequired,
      sampleRate: PropTypes.number.isRequired,
      trackNumber: PropTypes.number.isRequired,
      codecProfile: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default AudioPlayer;
