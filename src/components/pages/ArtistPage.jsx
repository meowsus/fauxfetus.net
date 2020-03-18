import React from 'react';
import PropTypes from 'prop-types';

import {
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from 'react-router-dom';

import '../Page.css';
import './ArtistPage.css';

import CONSTANTS from '../../constants';

import AlbumPage from './AlbumPage';
import AlbumCard from '../AlbumCard';

function ArtistPage(props) {
  const { catalog, setPlaylist } = props;
  const { artistSlug } = useParams();
  const { path } = useRouteMatch();

  const artist = catalog[artistSlug];
  const albums = (
    Object
      .entries(artist.albums)
      .map(([k, v]) => ({ ...v, slug: k }))
  );

  return (
    <Switch>
      <Route exact path={path}>
        <div className="ArtistPage">
          <div className="Page-head">
            <h1>{artist.name}</h1>
          </div>

          <div className="ArtistPage-albums">
            {albums.map((album) => (
              <AlbumCard
                grid
                key={album.path}
                album={album}
                artistSlug={artistSlug}
              />
            ))}
          </div>
        </div>
      </Route>

      <Route
        path={`${path}/:albumSlug`}
        render={() => (
          <AlbumPage artist={artist} setPlaylist={setPlaylist} />
        )}
      />
    </Switch>
  );
}

ArtistPage.propTypes = {
  setPlaylist: PropTypes.func.isRequired,
  catalog: CONSTANTS.sharedPropTypes.catalog.isRequired,
};

export default ArtistPage;
