import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import './Page.css';

import CONSTANTS from '../constants';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ArtistPage from './pages/ArtistPage';
import UpdatesPage from './pages/UpdatesPage';
import ContributionsPage from './pages/ContributionsPage';

function Page(props) {
  const { catalog, setPlaylist } = props;

  return (
    <div className="Page">
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/updates" component={UpdatesPage} />
        <Route path="/contributions" component={ContributionsPage} />

        <Route
          path="/artist/:artistSlug"
          render={() => (
            <ArtistPage catalog={catalog} setPlaylist={setPlaylist} />
          )}
        />
      </Switch>
    </div>
  );
}

Page.propTypes = {
  setPlaylist: PropTypes.func.isRequired,
  catalog: PropTypes.objectOf(
    CONSTANTS.sharedPropTypes.catalogEntry.isRequired,
  ).isRequired,
};


export default Page;
