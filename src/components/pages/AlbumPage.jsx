import React from 'react';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import '../Page.css';

import TrackList from '../TrackList';

function AlbumPage(props) {
  const { artist } = props;
  const { artistSlug, albumSlug } = useParams();

  const album = artist.albums[albumSlug];

  return (
    <section className="AlbumPage">
      <div className="Page-head">
        <h1>
          <Link to={`/artist/${artistSlug}`}>
            {artist.name}
          </Link>
        </h1>
        <h2>{album.name}</h2>
      </div>

      <TrackList tracks={album.tracks} />
    </section>
  );
}

AlbumPage.propTypes = {
  artist: PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    albums: PropTypes.objectOf(
      PropTypes.shape({
        art: PropTypes.arrayOf(
          PropTypes.string.isRequired,
        ).isRequired,
        name: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
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
};

export default AlbumPage;
