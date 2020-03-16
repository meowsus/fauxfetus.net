import React from 'react';
import PropTypes from 'prop-types';

import './AudioControlButton.css';

import { ReactComponent as PlayButton } from '../images/play.svg';
import { ReactComponent as PauseButton } from '../images/pause.svg';
import { ReactComponent as RandomButton } from '../images/random.svg';
import { ReactComponent as PreviousButton } from '../images/previous.svg';
import { ReactComponent as NextButton } from '../images/next.svg';

function AudioControlButton(props) {
  const { type, isPlaying, onClick } = props;

  const buttonTypes = {
    play: isPlaying ? (
      <PauseButton title="Pause audio" />
    ) : (
      <PlayButton title="Play audio" />
    ),
    random: <RandomButton title="Play the Faux Fetus catalog, shuffled" />,
    previous: <PreviousButton title="Play previous track" />,
    next: <NextButton title="Play next track" />,
  };

  return (
    <button
      type="button"
      className={`AudioControlButton AudioControlButton--${type}`}
      onClick={onClick}
    >
      {buttonTypes[type]}
    </button>
  );
}

AudioControlButton.defaultProps = {
  isPlaying: false,
};

AudioControlButton.propTypes = {
  isPlaying: PropTypes.bool,
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default AudioControlButton;
