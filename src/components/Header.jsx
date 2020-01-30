import React from 'react';
import { Link } from 'react-router-dom';

import '../assets/styles/Header.css';

import { ReactComponent as MenuIcon } from '../assets/images/menu.svg';
import { ReactComponent as ContactIcon } from '../assets/images/contact.svg';

function Header() {
  return (
    <div className="Header">
      <div className="constrainer clearfix">
        <div className="Header-menu">
          <button
            className="Header-button"
            type="button"
          >
            <MenuIcon
              className="Header-icon"
              title="Main Menu Icon"
            />
          </button>
        </div>

        <Link
          to="/"
          className="Header-logo"
        >
          FauxFetus
        </Link>

        <div className="Header-contact">
          <button
            className="Header-button"
            type="button"
          >
            <ContactIcon
              className="Header-icon"
              title="Main Menu Icon"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
