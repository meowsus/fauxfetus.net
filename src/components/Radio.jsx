import React from 'react';
import Sound from 'react-sound';
import PropTypes from 'prop-types';

import shuffle from 'lodash.shuffle';

import '../assets/styles/Radio.css';

import RadioButton from './RadioButton';

class Radio extends React.Component {
  constructor(props) {
    super(props);

    const { tracks } = props;

    this.tracks = shuffle(tracks);

    this.handlePlayButtonClick = this.handlePlayButtonClick.bind(this);
    this.handlePreviousButtonClick = this.handlePreviousButtonClick.bind(this);
    this.handleNextButtonClick = this.handleNextButtonClick.bind(this);

    this.state = {
      currentTrack: this.getTrack(0),
      isPlaying: false,
      playStatus: Sound.status.STOPPED,
    };
  }

  getTrackIndex(direction) {
    const { currentTrack } = this.state;

    if (direction === 'previous') {
      return currentTrack.index === 0
        ? this.tracks.length - 1
        : currentTrack.index - 1;
    }

    if (direction === 'next') {
      return currentTrack.index === this.tracks.length - 1
        ? 0
        : currentTrack.index + 1;
    }

    return currentTrack.index;
  }

  getTrack(index) {
    const {
      file,
      album,
      title,
      artist,
    } = this.tracks[index];

    const fileUrl = process.env.PUBLIC_URL + file;

    return {
      fileUrl,
      album,
      title,
      artist,
      index,
    };
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

  handlePlayButtonClick() {
    this.setState((state) => ({
      isPlaying: !state.isPlaying,
      playStatus: !state.isPlaying ? Sound.status.PLAYING : Sound.status.PAUSED,
    }));
  }

  render() {
    const {
      isPlaying,
      playStatus,
      currentTrack,
    } = this.state;

    return (
      <div className="Radio">
        <div className="Radio-ui">
          <RadioButton
            type="play"
            isPlaying={isPlaying}
            onClick={this.handlePlayButtonClick}
          />
          <div className="Radio-display">
            <strong>{currentTrack.title}</strong>
            <span>by</span>
            <em>{currentTrack.artist}</em>
            <span>from</span>
            {`"${currentTrack.album}"`}
          </div>
          <RadioButton
            type="previous"
            isPlaying={isPlaying}
            onClick={this.handlePreviousButtonClick}
          />
          <RadioButton
            type="next"
            isPlaying={isPlaying}
            onClick={this.handleNextButtonClick}
          />
        </div>

        <Sound
          url={currentTrack.fileUrl}
          playStatus={playStatus}
          onFinishedPlaying={this.handleNextButtonClick}
        />
      </div>
    );
  }
}

Radio.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Radio;
