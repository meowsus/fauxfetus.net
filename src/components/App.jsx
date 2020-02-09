import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { getTracks, getArtists } from '../transformers';

import './App.css';

import Header from './Header';
import AudioPlayer from './AudioPlayer';
import Page from './Page';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      catalog: {},
      isLoading: true,
    };
  }

  componentDidMount() {
    fetch(`${process.env.PUBLIC_URL}/catalog.json`)
      .then((response) => response.json())
      .then((catalog) => this.setState({ catalog }))
      .then(() => this.setState({ isLoading: false }));
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !nextState.isLoading;
  }

  render() {
    const { catalog, isLoading } = this.state;

    return (
      <BrowserRouter>
        {!isLoading && (
          <div className="App">
            <Header artists={getArtists(catalog)} />

            <div className="App-body [ constrainer ]">
              <Page catalog={catalog} />
            </div>

            <AudioPlayer tracks={getTracks(catalog)} />
          </div>
        )}
      </BrowserRouter>
    );
  }
}

export default App;
