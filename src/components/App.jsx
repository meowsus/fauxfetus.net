import React from 'react';
import shuffle from 'lodash.shuffle';
import { BrowserRouter } from 'react-router-dom';

import '../assets/styles/App.css';

import Header from './Header';
import Radio from './Radio';
import Page from './Page';

import tracks from '../tracks.json';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="App-header">
          <Header />
          <Radio tracks={shuffle(tracks)} />
        </div>
        <div className="constrainer">
          <div className="App-body">
            <div className="App-content">
              <Page />
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
