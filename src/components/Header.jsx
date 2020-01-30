import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import '../assets/styles/Header.css';

import { ReactComponent as MenuIcon } from '../assets/images/menu.svg';
import { ReactComponent as ContactIcon } from '../assets/images/contact.svg';

function Header(props) {
  const { isLoading } = props;

  return (
    <div className={isLoading ? 'Header Header--loading' : 'Header'}>
      <div className="constrainer clearfix">
        <div className="Header-menu">
          {!isLoading && (
            <button
              className="Header-button"
              type="button"
            >
              <MenuIcon
                className="Header-icon"
                title="Main Menu Icon"
              />
            </button>
          )}
        </div>

        <Link
          to="/"
          className="Header-logo"
        >
          FauxFetus
        </Link>

        <div className="Header-contact">
          {!isLoading && (
            <button
              className="Header-button"
              type="button"
            >
              <ContactIcon
                className="Header-icon"
                title="Main Menu Icon"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default Header;
