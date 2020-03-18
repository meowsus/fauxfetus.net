import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import './App.css';

import Header from './Header';
import AudioPlayer from './AudioPlayer';
import Page from './Page';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [catalog, setCatalog] = useState({});
  const [playlist, setPlaylist] = useState([]);

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
          <Header catalog={catalog} />

          <div className="App-body [ constrainer ]">
            <Page catalog={catalog} setPlaylist={setPlaylist} />
          </div>

          <AudioPlayer
            playlist={playlist}
            setPlaylist={setPlaylist}
            catalog={catalog}
          />
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
