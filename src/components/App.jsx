import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { getTracks, getArtists } from '../transformers';

import './App.css';

import Header from './Header';
import AudioPlayer from './AudioPlayer';
import Page from './Page';

const useCatalog = () => {
  const [catalog, setCatalog] = useState({});
  return [catalog, setCatalog];
};

const usePlaylist = () => {
  const [playlist, setPlaylist] = useState([]);
  return [playlist, setPlaylist];
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const [catalog, setCatalog] = useCatalog();
  const [playlist, setPlaylist] = usePlaylist();

  useEffect(() => {
    if (!isLoading) { return; }

    fetch(`${process.env.PUBLIC_URL}/catalog.json`)
      .then((response) => response.json())
      .then((json) => setCatalog(json))
      .then(() => setIsLoading(false));
  }, [isLoading, setCatalog]);

  return (
    <BrowserRouter>
      {!isLoading && (
        <div className="App">
          <Header artists={getArtists(catalog)} />

          <div className="App-body [ constrainer ]">
            <Page catalog={catalog} />
          </div>

          <AudioPlayer
            playlist={playlist}
            setPlaylist={setPlaylist}
            allTracks={getTracks(catalog)}
          />
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
