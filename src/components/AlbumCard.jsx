import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './AlbumCard.css';

function AlbumCard(props) {
  const { artistSlug, album } = props;

  const coverArt = album.art[0];

  return (
    <Link
      className="AlbumCard"
      to={`/artist/${artistSlug}/${album.slug}`}
    >
      <h2 className="AlbumCard-title">{album.name}</h2>
      {coverArt && (
        <img
          className="AlbumCard-image"
          alt={`${album.name} Cover Art`}
          src={coverArt.replace(/^public/, process.env.PUBLIC_URL)}
        />
      )}
    </Link>
  );
}

AlbumCard.propTypes = {
  artistSlug: PropTypes.string.isRequired,
  album: PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
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
};

export default AlbumCard;

