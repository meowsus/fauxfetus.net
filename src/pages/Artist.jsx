import React from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

function Artist(props) {
  const { catalog } = props;
  const { slug } = useParams();

  const artist = catalog[slug];

  return (
    <div className="Artist">
      <h1>{artist.name}</h1>
    </div>
  );
}

Artist.propTypes = {
  catalog: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      albums: PropTypes.objectOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          tracks: PropTypes.arrayOf(
            PropTypes.shape({
              file: PropTypes.string.isRequired,
              title: PropTypes.string.isRequired,
              titleSlug: PropTypes.string.isRequired,
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

export default Artist;
