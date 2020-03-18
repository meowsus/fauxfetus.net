import React, { useState, useEffect } from 'react';
import Sound from 'react-sound';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import shuffle from 'lodash.shuffle';

import CONSTANTS from '../constants';
import { getTracks } from '../transformers';

import './AudioPlayer.css';

import AudioControlButton from './AudioControlButton';

const getTrackIndex = (direction, fromIndex, playlist) => {
  if (direction === 'previous') {
    return fromIndex === 0 ? playlist.length - 1 : fromIndex - 1;
  }

  if (direction === 'next') {
    return fromIndex === playlist.length - 1 ? 0 : fromIndex + 1;
  }

  return fromIndex;
};

const getTrack = (index, playlist) => {
  const { filePath } = playlist[index];
  const fileUrl = filePath.replace(/^public/, process.env.PUBLIC_URL);

  return {
    ...playlist[index],
    index,
    fileUrl,
  };
};

function AudioPlayer(props) {
  const { catalog, playlist, setPlaylist } = props;

  const [playStatus, setPlayStatus] = useState(Sound.status.STOPPED);
  const [currentTrack, setCurrentTrack] = useState(null);

  const handleRandomButtonClick = () => {
    const newPlaylist = shuffle(getTracks(catalog));

    setPlaylist(newPlaylist);
    setCurrentTrack(getTrack(0, newPlaylist));
    setPlayStatus(Sound.status.PLAYING);
  };

  const handlePlayButtonClick = () => {
    if (currentTrack === null) {
      handleRandomButtonClick();
      return;
    }

    switch (playStatus) {
      case Sound.status.STOPPED:
      case Sound.status.PAUSED:
        setPlayStatus(Sound.status.PLAY);
        break;
      default:
        setPlayStatus(Sound.status.PAUSED);
        break;
    }
  };

  const handlePreviousButtonClick = () => {
    const trackIndex = getTrackIndex('previous', currentTrack.index, playlist);
    setCurrentTrack(getTrack(trackIndex, playlist));
  };

  const handleNextButtonClick = () => {
    const trackIndex = getTrackIndex('next', currentTrack.index, playlist);
    setCurrentTrack(getTrack(trackIndex, playlist));
  };

  //useEffect(() => {
  //  if (playlist.length === 0) { return; }
  //  setCurrentTrack(getTrack(0, playlist));
  //  handlePlayButtonClick();
  //}, [playlist]);

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
            {currentTrack === null ? (
              'Press Play to start Radio'
            ) : (
              currentTrack.title
            )}
          </strong>
          {currentTrack && (
            <span className="AudioPlayer-info">
              <span>from</span>
              <Link to={`/artist/${currentTrack.artistSlug}/${currentTrack.albumSlug}`}>{currentTrack.album}</Link>
              <span>by</span>
              <Link to={`/artist/${currentTrack.artistSlug}`}>{currentTrack.artist}</Link>
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
          url={currentTrack.fileUrl || ''}
          playStatus={playStatus}
          onFinishedPlaying={handleNextButtonClick}
        />
      )}
    </div>
  );
}

AudioPlayer.propTypes = {
  setPlaylist: PropTypes.func.isRequired,
  playlist: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      album: PropTypes.string.isRequired,
      artist: PropTypes.string.isRequired,
      filePath: PropTypes.string.isRequired,
      albumSlug: PropTypes.string.isRequired,
      artistSlug: PropTypes.string.isRequired,
      extra: PropTypes.shape({
        bitrate: PropTypes.number.isRequired,
        duration: PropTypes.number.isRequired,
        sampleRate: PropTypes.number.isRequired,
        trackNumber: PropTypes.number.isRequired,
        codecProfile: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  ).isRequired,
  catalog: CONSTANTS.sharedPropTypes.catalog.isRequired,
};

export default AudioPlayer;
