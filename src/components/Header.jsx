import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './Header.css';

import CONSTANTS from '../constants';

import HeaderMenu from './HeaderMenu';
import HeaderButton from './HeaderButton';

function Header(props) {
  const { catalog } = props;

  const openMenu = (header) => {
    const menuIcon = header.querySelector('.HeaderButton-icon--menu');

    header.classList.add('Header--full');
    menuIcon.classList.add('HeaderButton-icon--active');
  };

  const closeMenu = (header) => {
    const menuIcon = header.querySelector('.HeaderButton-icon--menu');

    header.classList.remove('Header--full');
    menuIcon.classList.remove('HeaderButton-icon--active');
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

  const onContactButtonClick = (event) => {
    event.preventDefault();
    window.location.href = 'mailto:curt@fauxfetus.net';
  };

  return (
    <div className="Header">
      <div className="Header-row [ constrainer clearfix ]">
        <HeaderButton type="menu" onClick={onHeaderButtonClick} />

        <Link to="/" className="Header-logo">
          FauxFetus
        </Link>

        <HeaderButton type="contact" onClick={onContactButtonClick} />
      </div>

      <HeaderMenu catalog={catalog} onLinkClick={onHeaderMenuLinkClick} />
    </div>
  );
}

Header.propTypes = {
  catalog: PropTypes.objectOf(
    CONSTANTS.sharedPropTypes.catalogEntry.isRequired,
  ).isRequired,
};

export default Header;
