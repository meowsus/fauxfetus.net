import React from 'react';
import Sound from 'react-sound';
import PropTypes from 'prop-types';

import '../assets/styles/AudioPlayer.css';

import playButton from '../assets/images/play.svg';
import pauseButton from '../assets/images/pause.svg';
import previousButton from '../assets/images/previous.svg';
import nextButton from '../assets/images/next.svg';

function getTrackIndex(direction, index, totalCount) {
  if (direction === 'previous') {
    return index === 0 ? totalCount - 1 : index - 1;
  }

  if (direction === 'next') {
    return index === totalCount - 1 ? 0 : index + 1;
  }

  return index;
}

function getCurrentTrack(data, index) {
  return {
    file: process.env.PUBLIC_URL + data[index].file,
    album: data[index].album,
    title: data[index].title,
    artist: data[index].artist,
  };
}

class AudioPlayer extends React.Component {
  constructor(props) {
    super(props);

    const { trackData } = this.props;

    this.state = {
      trackData,
      trackIndex: 0,
      isPlaying: false,
      currentTrack: getCurrentTrack(trackData, 0),
      playStatus: Sound.status.STOPPED,
    };
  }

  changeTrack(direction) {
    this.setState((state) => {
      const trackIndex = getTrackIndex(
        direction,
        state.trackIndex,
        state.trackData.length,
      );

      const currentTrack = getCurrentTrack(state.trackData, trackIndex);

      return { trackIndex, currentTrack };
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
      <div className="AudioPlayer">
        <div className="constrainer">
          <div className="AudioPlayer-ui">
            <div className="AudioPlayer-control">
              <input
                type="image"
                src={isPlaying ? pauseButton : playButton}
                alt={isPlaying ? 'Pause Track' : 'Play Track'}
                onClick={() => this.playOrPauseTrack()}
              />
            </div>
            <div className="AudioPlayer-display">
              <strong>{currentTrack.title}</strong>
              <span>by</span>
              <em>{currentTrack.artist}</em>
              <span>from</span>
              {`"${currentTrack.album}"`}
            </div>
            <div className="AudioPlayer-control">
              <input
                type="image"
                src={previousButton}
                alt="Previous Track"
                onClick={() => this.changeTrack('previous')}
              />
            </div>
            <div className="AudioPlayer-control">
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
          url={currentTrack.file}
          playStatus={playStatus}
          onFinishedPlaying={() => this.changeTrack('next')}
        />
      </div>
    );
  }
}

AudioPlayer.propTypes = {
  trackData: PropTypes.isRequired,
};

export default AudioPlayer;
