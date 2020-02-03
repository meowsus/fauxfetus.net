import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './Header.css';

import HeaderMenu from './HeaderMenu';
import HeaderButton from './HeaderButton';

function Header(props) {
  const { artists } = props;

  const openMenu = (header) => {
    const menuButton = header.querySelector('.HeaderButton--menu');

    header.classList.add('Header--full');
    menuButton.classList.add('HeaderButton--active');
  };

  const closeMenu = (header) => {
    const menuButton = header.querySelector('.HeaderButton--menu');

    header.classList.remove('Header--full');
    menuButton.classList.remove('HeaderButton--active');
  };

  const onHeaderButtonClick = (event) => {
    const header = event.target.closest('.Header');
    const menuIsActive = header.classList.contains('Header--full');

    if (menuIsActive) {
      closeMenu(header);
    } else {
      openMenu(header);
    }
  };

  const onHeaderMenuLinkClick = (event) => {
    const header = event.target.closest('.Header');
    closeMenu(header);
  };

  const onContactButtonClick = (event) => {};

  return (
    <div className="Header">
      <div className="Header-row [ constrainer clearfix ]">
        <div className="Header-left">
          <HeaderButton type="menu" onClick={onHeaderButtonClick} />
        </div>

        <div className="Header-center">
          <Link
            to="/"
            className="Header-logo"
          >
            FauxFetus
          </Link>
        </div>

        <div className="Header-right">
          <HeaderButton type="contact" onClick={onContactButtonClick} />
        </div>
      </div>

      <HeaderMenu artists={artists} onLinkClick={onHeaderMenuLinkClick} />
    </div>
  );
}

Header.propTypes = {
  artists: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Header;
