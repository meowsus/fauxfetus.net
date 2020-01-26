import React from 'react';
import Sound from 'react-sound';
import PropTypes from 'prop-types';

import '../assets/styles/Radio.css';

import playButton from '../assets/images/play.svg';
import pauseButton from '../assets/images/pause.svg';
import previousButton from '../assets/images/previous.svg';
import nextButton from '../assets/images/next.svg';

class Radio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPlaying: false,
      currentTrack: this.getTrack(0),
      playStatus: Sound.status.STOPPED,
    };
  }

  getTrackIndex(direction) {
    const { tracks } = this.props;
    const { currentTrack } = this.state;

    if (direction === 'previous') {
      return currentTrack.index === 0
        ? tracks.length - 1
        : currentTrack.index - 1;
    }

    if (direction === 'next') {
      return currentTrack.index === tracks.length - 1
        ? 0
        : currentTrack.index + 1;
    }

    return currentTrack.index;
  }

  getTrack(index) {
    const { tracks } = this.props;

    const {
      file,
      album,
      title,
      artist,
    } = tracks[index];

    const fileUrl = process.env.PUBLIC_URL + file;

    return {
      fileUrl,
      album,
      title,
      artist,
      index,
    };
  }

  changeTrack(direction) {
    const nextTrackIndex = this.getTrackIndex(direction);

    this.setState({
      currentTrack: this.getTrack(nextTrackIndex),
    });
  }

  playOrPauseTrack() {
    this.setState((state) => ({
      isPlaying: !state.isPlaying,
      playStatus: !state.isPlaying ? Sound.status.PLAYING : Sound.status.PAUSED,
    }));
  }

  render() {
    const { isPlaying, currentTrack, playStatus } = this.state;

    return (
      <div className="Radio">
        <div className="constrainer">
          <div className="Radio-ui">
            <div className="Radio-control">
              <input
                type="image"
                src={isPlaying ? pauseButton : playButton}
                alt={isPlaying ? 'Pause Track' : 'Play Track'}
                onClick={() => this.playOrPauseTrack()}
              />
            </div>
            <div className="Radio-display">
              <strong>{currentTrack.title}</strong>
              <span>by</span>
              <em>{currentTrack.artist}</em>
              <span>from</span>
              {`"${currentTrack.album}"`}
            </div>
            <div className="Radio-control">
              <input
                type="image"
                src={previousButton}
                alt="Previous Track"
                onClick={() => this.changeTrack('previous')}
              />
            </div>
            <div className="Radio-control">
              <input
                type="image"
                src={nextButton}
                alt="Next Track"
                onClick={() => this.changeTrack('next')}
              />
            </div>
          </div>
        </div>

        <Sound
          url={currentTrack.fileUrl}
          playStatus={playStatus}
          onFinishedPlaying={() => this.changeTrack('next')}
        />
      </div>
    );
  }
}

Radio.propTypes = {
  tracks: PropTypes.isRequired,
};

export default Radio;
