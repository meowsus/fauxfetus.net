import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';

import './Page.css';

import CONSTANTS from '../constants';

import HomePage from '../pages/home.md';

import ArtistPage from './ArtistPage';

function ContentPage(props) {
  const { page } = props;
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch(page)
      .then((response) => response.text())
      .then((text) => setContent(text));

    return () => {};
  }, []);

  return <ReactMarkdown source={content} />;
}

ContentPage.propTypes = {
  page: PropTypes.string.isRequired,
};

function Page(props) {
  const { catalog, setPlaylist, setTrackIndex } = props;

  return (
    <div className="Page">
      <Switch>
        <Route
          exact
          path="/"
          render={() => (
            <ContentPage page={HomePage} />
          )}
        />

        <Route
          path="/artist/:artistSlug"
          render={() => (
            <ArtistPage
              catalog={catalog}
              setPlaylist={setPlaylist}
              setTrackIndex={setTrackIndex}
            />
          )}
        />
      </Switch>
    </div>
  );
}

Page.propTypes = {
  setPlaylist: PropTypes.func.isRequired,
  setTrackIndex: PropTypes.func.isRequired,

  catalog: PropTypes.objectOf(
    CONSTANTS.sharedPropTypes.catalogEntry.isRequired,
  ).isRequired,
};

export default Page;
