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

import Album from './AlbumPage';
import AlbumCard from '../AlbumCard';

function ArtistPage(props) {
  const { catalog } = props;
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
        render={() => <Album artist={artist} />}
      />
    </Switch>
  );
}

ArtistPage.propTypes = {
  catalog: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      albums: PropTypes.objectOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          path: PropTypes.string.isRequired,
          art: PropTypes.arrayOf(
            PropTypes.string.isRequired,
          ).isRequired,
          tracks: PropTypes.arrayOf(
            PropTypes.shape({
              slug: PropTypes.string.isRequired,
              title: PropTypes.string.isRequired,
              filePath: PropTypes.string.isRequired,
              extra: PropTypes.shape({
                bitrate: PropTypes.number.isRequired,
                duration: PropTypes.number.isRequired,
                sampleRate: PropTypes.number.isRequired,
                trackNumber: PropTypes.number.isRequired,
                codecProfile: PropTypes.string.isRequired,
              }).isRequired,
            }).isRequired,
          ).isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  ).isRequired,
};

export default ArtistPage;
