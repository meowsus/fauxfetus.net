import React from 'react';
import PropTypes from 'prop-types';

import {
  Link,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from 'react-router-dom';

import Album from './Album';

function Artist(props) {
  const { catalog } = props;
  const { artistSlug } = useParams();
  const { path, url } = useRouteMatch();

  const artist = catalog[artistSlug];
  const albums = (
    Object
      .entries(artist.albums)
      .map(([k, v]) => ({ ...v, slug: k }))
  );

  return (
    <Switch>
      <Route exact path={path}>
        <div className="Artist">
          <h1>{artist.name}</h1>

          <div className="Artist-album-grid">
            {albums.map((album) => (
              <Link to={`${url}/${album.slug}`} key={album.slug}>
                <div className="Artist-album">
                  <h2>{album.name}</h2>
                  <ol className="Artist-album-art">
                    {album.art.map((src) => (
                      <li key={src}>
                        <img
                          src={src.replace(/^public/, process.env.PUBLIC_URL)}
                          alt="Album Art"
                        />
                      </li>
                    ))}
                  </ol>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Route>

      <Route
        path={`${path}/:albumSlug`}
        render={() => <Album catalog={catalog} />}
      />
    </Switch>
  );
}

Artist.propTypes = {
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
            }).isRequired,
          ).isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  ).isRequired,
};

export default Artist;
