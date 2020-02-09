import React from 'react';
import Sound from 'react-sound';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import shuffle from 'lodash.shuffle';

import './AudioPlayer.css';

import AudioPlayerButton from './AudioPlayerButton';

class AudioPlayer extends React.Component {
  constructor(props) {
    super(props);

    const { tracks } = props;

    this.allTracks = tracks;

    this.handlePlayButtonClick = this.handlePlayButtonClick.bind(this);
    this.handleRandomButtonClick = this.handleRandomButtonClick.bind(this);
    this.handlePreviousButtonClick = this.handlePreviousButtonClick.bind(this);
    this.handleNextButtonClick = this.handleNextButtonClick.bind(this);

    this.state = {
      playlist: [],
      currentTrack: null,
      isPlaying: false,
      playStatus: Sound.status.STOPPED,
    };
  }

  getTrackIndex(direction) {
    const { currentTrack } = this.state;

    if (direction === 'previous') {
      return currentTrack.index === 0
        ? this.playlist.length - 1
        : currentTrack.index - 1;
    }

    if (direction === 'next') {
      return currentTrack.index === this.playlist.length - 1
        ? 0
        : currentTrack.index + 1;
    }

    return currentTrack.index;
  }

  getTrack(index) {
    const { filePath } = this.playlist[index];
    const fileUrl = filePath.replace(/^public/, process.env.PUBLIC_URL);

    return {
      ...this.playlist[index],
      index,
      fileUrl,
    };
  }

  handlePlayButtonClick() {
    const { currentTrack } = this.state;

    if (currentTrack === null) {
      this.handleRandomButtonClick();
      return;
    }

    this.setState((state) => ({
      isPlaying: !state.isPlaying,
      playStatus: !state.isPlaying ? Sound.status.PLAYING : Sound.status.PAUSED,
    }));
  }

  handleRandomButtonClick() {
    this.playlist = shuffle(this.allTracks);

    this.setState({
      isPlaying: true,
      currentTrack: this.getTrack(0),
      playStatus: Sound.status.PLAYING,
    });
  }

  handlePreviousButtonClick() {
    const trackIndex = this.getTrackIndex('previous');
    const currentTrack = this.getTrack(trackIndex);

    this.setState({ currentTrack });
  }

  handleNextButtonClick() {
    const trackIndex = this.getTrackIndex('next');
    const currentTrack = this.getTrack(trackIndex);

    this.setState({ currentTrack });
  }

  render() {
    const {
      isPlaying,
      playStatus,
      currentTrack,
    } = this.state;

    const {
      title,
      artist,
      album,
      artistSlug,
      albumSlug,
      fileUrl,
    } = currentTrack || {};

    return (
      <div className="AudioPlayer">
        <div className="AudioPlayer-layout">
          <AudioPlayerButton
            type="random"
            isPlaying={isPlaying}
            onClick={this.handleRandomButtonClick}
          />

          <AudioPlayerButton
            type="play"
            isPlaying={isPlaying}
            onClick={this.handlePlayButtonClick}
          />

          <div className="AudioPlayer-display">
            <strong className="AudioPlayer-title">
              {currentTrack === null ? 'Press Play to start Radio' : title}
            </strong>
            {currentTrack && (
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
            isPlaying={isPlaying}
            onClick={this.handlePreviousButtonClick}
          />

          <AudioPlayerButton
            type="next"
            isPlaying={isPlaying}
            onClick={this.handleNextButtonClick}
          />
        </div>

        <Sound
          url={fileUrl || ''}
          playStatus={playStatus}
          onFinishedPlaying={this.handleNextButtonClick}
        />
      </div>
    );
  }
}

AudioPlayer.propTypes = {
  tracks: PropTypes.arrayOf(
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
};

export default AudioPlayer;
