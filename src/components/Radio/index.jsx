import React from 'react';
import Sound from 'react-sound';

import shuffle from 'lodash.shuffle';

import '../../assets/styles/Radio.css';

import RadioButton from './RadioButton';

class Radio extends React.Component {
  constructor(props) {
    super(props);

    this.handlePlayButtonClick = this.handlePlayButtonClick.bind(this);
    this.handlePreviousButtonClick = this.handlePreviousButtonClick.bind(this);
    this.handleNextButtonClick = this.handleNextButtonClick.bind(this);

    this.state = {
      tracks: null,
      currentTrack: null,
      isLoading: true,
      isPlaying: false,
      playStatus: Sound.status.STOPPED,
    };
  }

  componentDidMount() {
    fetch(`${process.env.PUBLIC_URL}/data/tracks.json`)
      .then((response) => response.json())
      .then((tracks) => this.setState({ tracks: shuffle(tracks) }))
      .then(() => {
        this.setState({
          isLoading: false,
          currentTrack: this.getTrack(0),
        });
      });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !nextState.isLoading;
  }

  getTrackIndex(direction) {
    const { tracks, currentTrack } = this.state;

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
    const { tracks } = this.state;

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

  handlePreviousButtonClick(event) {
    const { isLoading } = this.state;

    const trackIndex = this.getTrackIndex('previous');
    const currentTrack = this.getTrack(trackIndex);

    if (isLoading) {
      event.preventDefault();
      return;
    }

    this.setState({ currentTrack });
  }

  handleNextButtonClick(event) {
    const { isLoading } = this.state;

    const trackIndex = this.getTrackIndex('next');
    const currentTrack = this.getTrack(trackIndex);

    if (isLoading) {
      event.preventDefault();
      return;
    }

    this.setState({ currentTrack });
  }

  handlePlayButtonClick(event) {
    const { isLoading } = this.state;

    if (isLoading) {
      event.preventDefault();
      return;
    }

    this.setState((state) => ({
      isPlaying: !state.isPlaying,
      playStatus: !state.isPlaying ? Sound.status.PLAYING : Sound.status.PAUSED,
    }));
  }

  render() {
    const {
      isPlaying,
      isLoading,
      playStatus,
      currentTrack,
    } = this.state;

    return (
      <div className="Radio">
        <div className="constrainer">
          <div className="Radio-ui">
            <div className="Radio-control">
              <RadioButton
                type="play"
                isPlaying={isPlaying}
                onClick={this.handlePlayButtonClick}
              />
            </div>
            { isLoading ? (
              <div className="Radio-display Radio-display--loading">
                Loading...
              </div>
            ) : (
              <div className="Radio-display">
                <strong>{currentTrack.title}</strong>
                <span>by</span>
                <em>{currentTrack.artist}</em>
                <span>from</span>
                {`"${currentTrack.album}"`}

                <Sound
                  url={currentTrack.fileUrl}
                  playStatus={playStatus}
                  onFinishedPlaying={() => this.changeTrack('next')}
                />
              </div>
            )}
            <div className="Radio-control">
              <RadioButton
                type="previous"
                isPlaying={isPlaying}
                onClick={this.handlePreviousButtonClick}
              />
            </div>
            <div className="Radio-control">
              <RadioButton
                type="next"
                isPlaying={isPlaying}
                onClick={this.handleNextButtonClick}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Radio;
