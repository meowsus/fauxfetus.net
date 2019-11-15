import React from 'react';
import Sound from 'react-sound';

import './AudioPlayer.css';

import playButton from '../images/play.svg'
import pauseButton from '../images/pause.svg'
import previousButton from '../images/previous.svg'
import nextButton from '../images/next.svg'

class AudioPlayer extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      trackIndex: 0,
      isPlaying: false,
      trackData: this.props.trackData,
      currentTrack: this.getCurrentTrack(this.props.trackData, 0),
      playStatus: Sound.status.STOPPED
    };
  }

  getTrackIndex (direction, index, totalCount) {
    if (direction === 'previous') {
      return index === 0 ? totalCount - 1 : index - 1;
    } else if (direction === 'next') {
      return index === totalCount - 1 ? 0 : index + 1;
    } else {
      return index;
    }
  }

  getCurrentTrack (data, index) {
    return {
      file: process.env.PUBLIC_URL + data[index].file,
      album: data[index].album,
      title: data[index].title,
      artist: data[index].artist
    };
  }

  changeTrack (direction) {
    const trackIndex = this.getTrackIndex(
      direction,
      this.state.trackIndex,
      this.state.trackData.length
    );

    const currentTrack = this.getCurrentTrack(
      this.state.trackData,
      trackIndex
    );

    this.setState({ trackIndex, currentTrack });
  }

  playOrPauseTrack () {
    const shouldPlay = ! this.state.isPlaying;

    this.setState({
      isPlaying: shouldPlay,
      playStatus: shouldPlay ? Sound.status.PLAYING : Sound.status.PAUSED
    });
  }

  render () {
    return (
      <div className='AudioPlayer'>
        <div className='constrainer'>
          <div className='AudioPlayer-ui'>
            <div className='AudioPlayer-control'>
              <img
                src={this.state.isPlaying ? pauseButton : playButton}
                alt={this.state.isPlaying ? 'Pause Track' : 'Play Track'}
                onClick={() => this.playOrPauseTrack()}
              />
            </div>
            <div className='AudioPlayer-display'>
              <strong>{this.state.currentTrack.title}</strong> by <em>{this.state.currentTrack.artist}</em> from "{this.state.currentTrack.album}"
            </div>
            <div className='AudioPlayer-control'>
              <img
                src={previousButton}
                alt='Previous Track'
                onClick={() => this.changeTrack('previous')}
              />
            </div>
            <div className='AudioPlayer-control'>
              <img
                src={nextButton}
                alt='Next Track'
                onClick={() => this.changeTrack('next')}
              />
            </div>
          </div>
        </div>

        <Sound
          url={this.state.currentTrack.file}
          playStatus={this.state.playStatus}
          onFinishedPlaying={() => this.changeTrack('next')}
        />
      </div>
    );
  };
}

export default AudioPlayer;

