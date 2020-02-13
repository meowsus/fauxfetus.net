import React from 'react';
import Sound from 'react-sound';
import { BrowserRouter } from 'react-router-dom';

import shuffle from 'lodash.shuffle';

import { getTracks, getArtists } from '../transformers';

import './App.css';

import Header from './Header';
import AudioPlayer from './AudioPlayer';
import Page from './Page';

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

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handlePlayButtonClick = this.handlePlayButtonClick.bind(this);
    this.handleShuffleCatalogButtonClick = (
      this.handleShuffleCatalogButtonClick.bind(this)
    );
    this.handleChangeTrackButtonClick = (
      this.handleChangeTrackButtonClick.bind(this)
    );

    this.state = {
      catalog: {},
      isLoading: true,
      audio: {
        loop: false,
        playlist: [],
        allTracks: [],
        isPlaying: false,
        currentTrack: {},
        catalogTracks: [],
        playStatus: Sound.status.STOPPED,
      },
    };
  }

  componentDidMount() {
    fetch(`${process.env.PUBLIC_URL}/catalog.json`)
      .then((response) => response.json())
      .then((catalog) => {
        this.setState((state) => ({
          catalog,
          audio: {
            ...state.audio,
            allTracks: getTracks(catalog),
          },
        }));
      })
      .then(() => this.setState({ isLoading: false }));
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !nextState.isLoading;
  }

  handlePlayButtonClick(playlist) {
    if (playlist.length === 0) {
      this.handleShuffleCatalogButtonClick();
      return;
    }

    this.setState((state) => ({
      audio: {
        ...state.audio,
        playlist,
        isPlaying: !state.isPlaying,
        playStatus: (
          !state.isPlaying ? Sound.status.PLAYING : Sound.status.PAUSED
        ),
      },
    }));
  }

  handleShuffleCatalogButtonClick() {
    const { allTracks } = this.state;
    const shuffledTracks = shuffle(allTracks);

    this.setState((state) => ({
      audio: {
        ...state.audio,
        isPlaying: true,
        playlist: shuffledTracks,
        playStatus: Sound.status.PLAYING,
        currentTrack: getTrack(0, shuffledTracks),
      },
    }));
  }

  handleChangeTrackButtonClick(direction) {
    const { currentTrack, playlist } = this.state;

    if (playlist.length === 0) { return; }

    const trackIndex = getTrackIndex(direction, currentTrack.index, playlist);

    this.setState({
      currentTrack: getTrack(trackIndex, playlist),
    });
  }

  render() {
    const { catalog, isLoading, audio } = this.state;

    return (
      <BrowserRouter>
        {!isLoading && (
          <div className="App">
            <Header artists={getArtists(catalog)} />

            <div className="App-body [ constrainer ]">
              <Page catalog={catalog} />
            </div>

            <AudioPlayer
              playlist={audio.playlist}
              isPlaying={audio.isPlaying}
              currentTrack={audio.currentTrack}
              onPlayButtonClick={this.handlePlayButtonClick}
              onChangeTrackButtonClick={this.handleChangeTrackButtonClick}
              onShuffleCatalogButtonClick={this.handleShuffleCatalogButtonClick}
            />

            <Sound
              url={audio.currentTrack.fileUrl || ''}
              playStatus={audio.playStatus}
              onFinishedPlaying={this.handleNextButtonClick}
            />
          </div>
        )}
      </BrowserRouter>
    );
  }
}

export default App;
