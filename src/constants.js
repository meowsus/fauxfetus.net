import PropTypes from 'prop-types';

const CONSTANTS = {
  sharedPropTypes: {
    catalogEntry: PropTypes.shape({
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
      ),
    }),

    playlistEntry: PropTypes.shape({
      slug: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      album: PropTypes.string.isRequired,
      artist: PropTypes.string.isRequired,
      filePath: PropTypes.string.isRequired,
      albumSlug: PropTypes.string.isRequired,
      artistSlug: PropTypes.string.isRequired,
      extra: PropTypes.shape({
        bitrate: PropTypes.number.isRequired,
        duration: PropTypes.number.isRequired,
        sampleRate: PropTypes.number.isRequired,
        trackNumber: PropTypes.number.isRequired,
        codecProfile: PropTypes.string.isRequired,
      }).isRequired,
    }),

    trackEntry: PropTypes.shape({
      slug: PropTypes.string,
      title: PropTypes.string,
      filePath: PropTypes.string,
      extra: PropTypes.shape({
        bitrate: PropTypes.number,
        duration: PropTypes.number,
        sampleRate: PropTypes.number,
        trackNumber: PropTypes.number,
        codecProfile: PropTypes.string,
      }),
    }),
  },
};

export default CONSTANTS;
