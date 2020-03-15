import React from 'react';
import PropTypes from 'prop-types';

import './HeaderButton.css';

import { ReactComponent as MenuIcon } from '../images/menu.svg';
import { ReactComponent as ContactIcon } from '../images/contact.svg';

function HeaderButton(props) {
  const { type, onClick } = props;

  const buttonIcon = {
    menu: (
      <MenuIcon
        className="HeaderButton-icon HeaderButton-icon--menu"
        title="Main Menu Icon"
      />
    ),
    contact: (
      <ContactIcon
        className="HeaderButton-icon HeaderButton-icon--contact"
        title="Contact Icon"
      />
    ),
  };

  return (
    <button
      type="button"
      onClick={(event) => onClick(event)}
      className="HeaderButton"
    >
      {buttonIcon[type]}
    </button>
  );
}

HeaderButton.propTypes = {
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default HeaderButton;
