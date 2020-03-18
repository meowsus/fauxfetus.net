import PropTypes from 'prop-types';

const CONSTANTS = {
  sharedPropTypes: {
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
    ),
  },
};

export default CONSTANTS;
