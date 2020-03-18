import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getArtists } from '../transformers';
import CONSTANTS from '../constants';

import './HeaderMenu.css';

function HeaderMenu(props) {
  const { catalog, onLinkClick } = props;

  return (
    <ul className="HeaderMenu">
      {getArtists(catalog).map((artist) => (
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
  catalog: CONSTANTS.sharedPropTypes.catalog.isRequired,
};

export default HeaderMenu;
