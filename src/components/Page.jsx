import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import './Page.css';

import Home from './pages/HomePage';
import About from './pages/AboutPage';
import Artist from './pages/ArtistPage';
import Updates from './pages/UpdatesPage';
import Contributions from './pages/ContributionsPage';

function Page(props) {
  const { catalog } = props;

  return (
    <div className="Page">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/updates" component={Updates} />
        <Route path="/contributions" component={Contributions} />

        <Route
          path="/artist/:artistSlug"
          render={() => <Artist catalog={catalog} />}
        />
      </Switch>
    </div>
  );
}

Page.propTypes = {
  catalog: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      albums: PropTypes.objectOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          path: PropTypes.string.isRequired,
          art: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
          tracks: PropTypes.arrayOf(
            PropTypes.shape({
              slug: PropTypes.string.isRequired,
              title: PropTypes.string.isRequired,
              filePath: PropTypes.string.isRequired,
              extra: PropTypes.shape({
                sampleRate: PropTypes.number.isRequired,
                bitrate: PropTypes.number.isRequired,
                codecProfile: PropTypes.string.isRequired,
                duration: PropTypes.number.isRequired,
                trackNumber: PropTypes.number.isRequired,
              }).isRequired,
            }),
          ).isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
};


export default Page;
