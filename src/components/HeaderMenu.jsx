import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './HeaderMenu.css';

function HeaderMenu(props) {
  const { artists, onLinkClick } = props;

  return (
    <ul className="HeaderMenu">
      {artists.map((artist) => (
        <li className="HeaderMenu-item" key={artist.slug}>
          <Link
            onClick={onLinkClick}
            className="HeaderMenu-link"
            to={`/artist/${artist.slug}`}
          >
            <span className="HeaderMenu-first-char">
              {artist.name.charAt(0)}
            </span>
            {artist.name.substring(1)}
          </Link>
        </li>
      ))}
    </ul>
  );
}

HeaderMenu.propTypes = {
  onLinkClick: PropTypes.func.isRequired,
  artists: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

export default HeaderMenu;
