import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { getTracks } from '../reducers';

import '../assets/styles/App.css';

import Header from './Header';
import Radio from './Radio';
import Page from './Page';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      catalog: {},
      loadingCatalog: true,
    };
  }

  componentDidMount() {
    fetch(`${process.env.PUBLIC_URL}/catalog.json`)
      .then((response) => response.json())
      .then((catalog) => this.setState({ catalog }))
      .then(() => this.setState({ loadingCatalog: false }));
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !nextState.loadingCatalog;
  }

  render() {
    const { catalog, loadingCatalog } = this.state;

    return (
      <BrowserRouter>
        { loadingCatalog ? (
          <span>Loading...</span>
        ) : (
          <div className="App">
            <div className="App-header">
              <Header />
              <Radio tracks={getTracks(catalog)} />
            </div>
            <div className="constrainer">
              <div className="App-body">
                <div className="App-content">
                  <Page />
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
