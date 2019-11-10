import React from 'react';

import './App.css';

import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Page from './components/Page'

function App() {
  return (
    <div className='App'>
      <div className='App-header'>
        <Header />
      </div>
      <div className='App-body'>
        <div className='App-sidebar'>
          <Sidebar />
        </div>
        <div className='App-content'>
          <Page />
        </div>
      </div>
    </div>
  );
}

export default App;
