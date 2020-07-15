import React, { useState, useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import Sound from 'react-sound'; // TODO just take statuses?

import { makePlaylistTrackFromPlaylist } from '../transformers';

import './App.css';

import Header from './Header';
import AudioPlayer from './AudioPlayer';
import Page from './Page';

const useAudioPlayer = () => {
  const [playlist, setPlaylist] = useState([]);
  const [playStatus, setPlayStatus] = useState(Sound.status.STOPPED);
  const [trackIndex, setTrackIndex] = useState(null);
  const [currentTrack, setCurrentTrack] = useState({});

  useEffect(() => {
    if (playlist.length === 0) return;
    setPlayStatus(Sound.status.STOPPED);
  }, [playlist]);

  useEffect(() => {
    if (playlist.length === 0) return;
    setCurrentTrack(makePlaylistTrackFromPlaylist(playlist, trackIndex));
    setPlayStatus(Sound.status.PLAYING);
  }, [playlist, trackIndex]);

  return {
    playlist,
    playStatus,
    setPlaylist,
    currentTrack,
    setTrackIndex,
    setPlayStatus,
  };
};

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [catalog, setCatalog] = useState({});

  const { playlist, playStatus, setPlaylist, currentTrack, setTrackIndex, setPlayStatus } = useAudioPlayer();

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    fetch(`${process.env.PUBLIC_URL}/catalog.json`)
      .then((response) => response.json())
      .then((json) => setCatalog(json))
      .then(() => setIsLoading(false));
  }, [isLoading, setCatalog]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      {!isLoading && (
        <div className="App">
          <Header catalog={catalog} />

          <div className="App-body [ constrainer ]">
            <Page
              catalog={catalog}
              setPlaylist={setPlaylist}
              setTrackIndex={setTrackIndex}
              currentFilePath={currentTrack.filePath}
            />
          </div>

          <AudioPlayer
            catalog={catalog}
            playlist={playlist}
            playStatus={playStatus}
            setPlaylist={setPlaylist}
            currentTrack={currentTrack}
            setTrackIndex={setTrackIndex}
            setPlayStatus={setPlayStatus}
          />
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
