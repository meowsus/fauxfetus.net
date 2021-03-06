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

  const getPreviousTrackIndex = () => (trackIndex - 1 < 0 ? 0 : trackIndex - 1);

  const getNextTrackIndex = () => (trackIndex + 1 >= playlist.length ? playlist.length - 1 : trackIndex + 1);

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

  const handleFinishedPlaying = () => {
    if (trackIndex === playlist.length - 1) setPlayStatus(Sound.status.STOPPED);
    else handleNextButtonClick();
  };

  return (
    <div className="AudioPlayer">
      <div className="AudioPlayer-layout">
        <AudioControlButton type="random" onClick={handleRandomButtonClick} />

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

        <AudioControlButton type="previous" onClick={handlePreviousButtonClick} />

        <AudioControlButton type="next" onClick={handleNextButtonClick} />
      </div>

      {currentTrack && <Sound url={trackUrl || ''} playStatus={playStatus} onFinishedPlaying={handleFinishedPlaying} />}
    </div>
  );
}

AudioPlayer.defaultProps = {
  currentTrack: {},
};

AudioPlayer.propTypes = {
  currentTrack: CONSTANTS.sharedPropTypes.trackEntry,

  playStatus: PropTypes.string.isRequired,
  setPlaylist: PropTypes.func.isRequired,
  setTrackIndex: PropTypes.func.isRequired,
  setPlayStatus: PropTypes.func.isRequired,

  playlist: PropTypes.arrayOf(CONSTANTS.sharedPropTypes.playlistEntry.isRequired).isRequired,

  catalog: PropTypes.objectOf(CONSTANTS.sharedPropTypes.catalogEntry.isRequired).isRequired,
};

export default AudioPlayer;
