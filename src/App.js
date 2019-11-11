import React from 'react';
import shuffle from 'lodash.shuffle';

import './App.css';

import Header from './components/Header';
import AudioPlayer from './components/AudioPlayer';
import Page from './components/Page';

import trackData from './tracks.json';

function App() {
  return (
    <div className='App'>
      <div className='App-header'>
        <Header />
        <AudioPlayer trackData={shuffle(trackData)} />
      </div>
      <div className='constrainer'>
        <div className='App-body'>
          <div className='App-content'>
            <Page />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
