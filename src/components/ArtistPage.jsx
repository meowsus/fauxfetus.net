import React from 'react';
import PropTypes from 'prop-types';

import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';

import CONSTANTS from '../constants';
import { makeAlbumsFromArtist } from '../transformers';

import './Page.css';
import './ArtistPage.css';

import AlbumPage from './AlbumPage';
import AlbumCard from './AlbumCard';

function ArtistPage(props) {
  const { catalog, setPlaylist, setTrackIndex, currentFilePath } = props;
  const { artistSlug } = useParams();
  const { path } = useRouteMatch();

  const artist = catalog[artistSlug];

  return (
    <Switch>
      <Route exact path={path}>
        <div className="ArtistPage">
          <div className="Page-head">
            <h1>{artist.name}</h1>
          </div>

          {artist.joined_on && artist.members && (
            <div className="ArtistPage-info">
              Joined on {artist.joined_on}
              &nbsp;| Members: {artist.members.join(' ')}
            </div>
          )}

          <div className="ArtistPage-albums">
            {makeAlbumsFromArtist(artist).map((album) => (
              <AlbumCard grid key={album.path} album={album} artistSlug={artistSlug} />
            ))}
          </div>
        </div>
      </Route>

      <Route
        path={`${path}/:albumSlug`}
        render={() => (
          <AlbumPage
            artist={artist}
            setPlaylist={setPlaylist}
            setTrackIndex={setTrackIndex}
            currentFilePath={currentFilePath}
          />
        )}
      />
    </Switch>
  );
}

ArtistPage.defaultProps = {
  currentFilePath: '',
};

ArtistPage.propTypes = {
  currentFilePath: PropTypes.string,

  setPlaylist: PropTypes.func.isRequired,
  setTrackIndex: PropTypes.func.isRequired,

  catalog: PropTypes.objectOf(CONSTANTS.sharedPropTypes.catalogEntry.isRequired).isRequired,
};

export default ArtistPage;
