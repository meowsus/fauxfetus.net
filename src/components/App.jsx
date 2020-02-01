import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { getTracks, getArtists } from '../reducers';

import '../assets/styles/App.css';

import Header from './Header';
import Radio from './Radio';
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

            <div className="App-body">
              <Radio tracks={getTracks(catalog)} />
              <div className="constrainer">
                <div className="App-content">
                  <Page catalog={catalog} />
                </div>
              </div>
            </div>
          </div>
        )}
      </BrowserRouter>
    );
  }
}

export default App;
