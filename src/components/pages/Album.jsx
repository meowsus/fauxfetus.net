import React from 'react';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

function Album(props) {
  const { catalog } = props;
  const { artistSlug, albumSlug } = useParams();

  const artist = catalog[artistSlug];
  const album = artist.albums[albumSlug];

  return (
    <div className="Album">
      <h1>
        <Link to={`/artist/${artistSlug}`}>
          {artist.name}
        </Link>
      </h1>

      <h2>{album.name}</h2>

      <ol className="Album-tracks">
        {album.tracks.map((track) => (
          <li key={track.slug}>
            {track.title}
          </li>
        ))}
      </ol>
    </div>
  );
}

Album.propTypes = {
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

export default Album;
