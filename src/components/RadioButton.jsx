import React from 'react';
import PropTypes from 'prop-types';

import './RadioButton.css';

import playButton from '../images/play.svg';
import pauseButton from '../images/pause.svg';
import previousButton from '../images/previous.svg';
import nextButton from '../images/next.svg';

function RadioButton(props) {
  const { type, isPlaying, onClick } = props;

  const buttonAttributes = {
    play: {
      src: isPlaying ? pauseButton : playButton,
      alt: isPlaying ? 'Pause Button' : 'Play Button',
    },
    previous: {
      src: previousButton,
      alt: 'Previous Track Button',
    },
    next: {
      src: nextButton,
      alt: 'Next Track Button',
    },
  };

  return (
    <input
      type="image"
      className={`RadioButton RadioButton--${type}`}
      src={buttonAttributes[type].src}
      alt={buttonAttributes[type].alt}
      onClick={onClick}
    />
  );
}

RadioButton.propTypes = {
  type: PropTypes.string.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default RadioButton;
