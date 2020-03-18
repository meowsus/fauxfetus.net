import React from 'react';
import PropTypes from 'prop-types';

import './TrackList.css';

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
  const { tracks, setPlaylist } = props;

  const handlePlayButtonClick = () => {
    setPlaylist(tracks);
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
      {tracks.map((track) => (
        <li key={track.filePath} className="TrackList-item">
          <span>
            <AudioControlButton
              type="play"
              onClick={handlePlayButtonClick}
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

TrackList.propTypes = {
  setPlaylist: PropTypes.func.isRequired,
  tracks: PropTypes.arrayOf(
    PropTypes.shape({
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
  ).isRequired,
};

export default TrackList;
