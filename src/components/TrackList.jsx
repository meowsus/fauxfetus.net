import React from 'react';
import PropTypes from 'prop-types';

import './TrackList.css';

import CONSTANTS from '../constants';

import AudioControlButton from './AudioControlButton';

const formatDuration = (duration) => {
  let seconds = Math.floor(duration);
  const minutes = Math.round(seconds / 60);

  seconds %= 60;

  return `${minutes}:${seconds > 9 ? seconds : `0${seconds}`}`;
};

const displayQuality = (extra) => {
  const { codecProfile } = extra;

  if (codecProfile.startsWith('V')) {
    return `${codecProfile} MP3`;
  }

  let { bitrate } = extra;
  bitrate = Math.round(bitrate / 1000);

  return `${bitrate} ${codecProfile} MP3`;
};

function TrackList(props) {
  const { tracks, currentFilePath, onAudioControlButtonClick } = props;

  const trackListItemClassName = (filePath) => {
    const className = ['TrackList-item'];

    if (filePath === currentFilePath) {
      className.push('TrackList-item--active');
    }

    return className.join(' ');
  };

  return (
    <ol className="TrackList">
      <li className="TrackList-item TrackList-item--heading">
        <span />
        <span>Title</span>
        <span className="align-right">#</span>
        <span className="align-right">Quality</span>
        <span className="align-right">Length</span>
      </li>
      {tracks.map((track, trackIndex) => (
        <li
          key={track.filePath}
          className={trackListItemClassName(track.filePath)}
        >
          <span>
            <AudioControlButton
              type="play"
              onClick={() => onAudioControlButtonClick(trackIndex)}
            />
          </span>
          <span>{track.title}</span>
          <span className="align-right">{track.extra.trackNumber}</span>
          <span className="align-right">{displayQuality(track.extra)}</span>
          <span className="align-right">
            {formatDuration(track.extra.duration)}
          </span>
        </li>
      ))}
    </ol>
  );
}

TrackList.defaultProps = {
  currentFilePath: '',
}

TrackList.propTypes = {
  currentFilePath: PropTypes.string,

  onAudioControlButtonClick: PropTypes.func.isRequired,

  tracks: PropTypes.arrayOf(
    CONSTANTS.sharedPropTypes.trackEntry.isRequired,
  ).isRequired,
};

export default TrackList;
