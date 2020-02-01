import React from 'react';
import PropTypes from 'prop-types';

import '../assets/styles/HeaderButton.css';

import { ReactComponent as MenuIcon } from '../assets/images/menu.svg';
import { ReactComponent as ContactIcon } from '../assets/images/contact.svg';

function RadioButton(props) {
  const { type, onClick } = props;

  const buttonIcon = {
    menu: (
      <MenuIcon
        className="HeaderButton-icon"
        title="Main Menu Icon"
      />
    ),
    contact: (
      <ContactIcon
        className="HeaderButton-icon"
        title="Main Menu Icon"
      />
    ),
  };

  return (
    <button
      type="button"
      onClick={(event) => onClick(event)}
      className={`HeaderButton HeaderButton--${type}`}
    >
      {buttonIcon[type]}
    </button>
  );
}

RadioButton.propTypes = {
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default RadioButton;
