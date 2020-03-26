import React from 'react';
import Sound from 'react-sound';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import shuffle from 'lodash.shuffle';
import isEmpty from 'lodash.isempty';

import CONSTANTS from '../constants';

import { makePlaylistFromCatalog } from '../transformers';

import './AudioPlayer.css';

import AudioControlButton from './AudioControlButton';

function AudioPlayer(props) {
  const {
    catalog,
    playlist,
    playStatus,
    setPlaylist,
    currentTrack,
    currentTrack: {
      albumSlug,
      artistSlug,
      album: albumName,
      index: trackIndex,
      title: trackTitle,
      fileUrl: trackUrl,
      artist: artistName,
    },
    setTrackIndex,
    setPlayStatus,
  } = props;

  const getPreviousTrackIndex = () => (
    (trackIndex - 1 < 0) ? 0 : trackIndex.index - 1
  );

  const getNextTrackIndex = () => (
    (trackIndex + 1 >= playlist.length) ? playlist.length : trackIndex + 1
  );

  const handleRandomButtonClick = () => {
    const catalogPlaylist = makePlaylistFromCatalog(catalog);
    setPlaylist(shuffle(catalogPlaylist));
    setTrackIndex(0);
  };

  const handlePlayButtonClick = () => {
    if (isEmpty(currentTrack)) {
      handleRandomButtonClick();
      return;
    }

    if (playStatus === Sound.status.PLAYING) {
      setPlayStatus(Sound.status.PAUSED);
    } else {
      setPlayStatus(Sound.status.PLAYING);
    }
  };

  const handlePreviousButtonClick = () => {
    setTrackIndex(getPreviousTrackIndex());
  };

  const handleNextButtonClick = () => {
    setTrackIndex(getNextTrackIndex());
  };

  return (
    <div className="AudioPlayer">
      <div className="AudioPlayer-layout">
        <AudioControlButton
          type="random"
          onClick={handleRandomButtonClick}
        />

        <AudioControlButton
          type="play"
          onClick={handlePlayButtonClick}
          isPlaying={playStatus === Sound.status.PLAYING}
        />

        <div className="AudioPlayer-display">
          <strong className="AudioPlayer-title">
            {isEmpty(currentTrack) ? 'Press Play to start Radio' : trackTitle}
          </strong>
          {!isEmpty(currentTrack) && (
            <span className="AudioPlayer-info">
              <span>from</span>
              <Link to={`/artist/${artistSlug}/${albumSlug}`}>{albumName}</Link>
              <span>by</span>
              <Link to={`/artist/${artistSlug}`}>{artistName}</Link>
            </span>
          )}
        </div>

        <AudioControlButton
          type="previous"
          onClick={handlePreviousButtonClick}
        />

        <AudioControlButton
          type="next"
          onClick={handleNextButtonClick}
        />
      </div>

      {currentTrack && (
        <Sound
          url={trackUrl || ''}
          playStatus={playStatus}
          onFinishedPlaying={handleNextButtonClick}
        />
      )}
    </div>
  );
}

AudioPlayer.defaultProps = {
  currentTrack: {},
  playStatus: Sound.status.STOPPED,
};

AudioPlayer.propTypes = {
  playStatus: PropTypes.string,
  currentTrack: CONSTANTS.sharedPropTypes.trackEntry,

  setPlaylist: PropTypes.func.isRequired,
  setTrackIndex: PropTypes.func.isRequired,
  setPlayStatus: PropTypes.func.isRequired,

  playlist: PropTypes.arrayOf(
    CONSTANTS.sharedPropTypes.playlistEntry.isRequired,
  ).isRequired,

  catalog: PropTypes.objectOf(
    CONSTANTS.sharedPropTypes.catalogEntry.isRequired,
  ).isRequired,
};

export default AudioPlayer;
