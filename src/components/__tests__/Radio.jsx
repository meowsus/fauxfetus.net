import React from 'react';
import Sound from 'react-sound';
import { shallow } from 'enzyme';

import tracks from '../../../public/data/tracks.json';

import Radio from '../Radio';

import play from '../../assets/images/play.svg';
import pause from '../../assets/images/pause.svg';

it('renders without crashing', () => {
  const wrapper = shallow(<Radio />);
  const { currentTrack } = wrapper.state();

  expect(wrapper.contains(currentTrack.title)).toEqual(true);
  expect(wrapper.contains(currentTrack.artist)).toEqual(true);
  expect(wrapper.contains(`"${currentTrack.album}"`)).toEqual(true);
});

it('formats currentTrack', () => {
  const wrapper = shallow(<Radio />);

  const firstTrack = tracks[0];
  const { currentTrack } = wrapper.state();

  expect(firstTrack.album).toEqual(currentTrack.album);
  expect(firstTrack.artist).toEqual(currentTrack.artist);
  expect(firstTrack.title).toEqual(currentTrack.title);

  expect(currentTrack.fileUrl).toContain(firstTrack.file);
  expect(currentTrack.index).toEqual(0);
});

it('plays and pauses the current track', () => {
  const { STOPPED, PLAYING, PAUSED } = Sound.status;
  const wrapper = shallow(<Radio />);

  expect(wrapper.state().isPlaying).toEqual(false);
  expect(wrapper.state().playStatus).toEqual(STOPPED);
  expect(wrapper.find('.Radio-button--play').prop('src')).toContain(play);

  wrapper.find('.Radio-button--play').simulate('click');

  expect(wrapper.state().isPlaying).toEqual(true);
  expect(wrapper.state().playStatus).toEqual(PLAYING);
  expect(wrapper.find('.Radio-button--play').prop('src')).toContain(pause);

  wrapper.find('.Radio-button--play').simulate('click');

  expect(wrapper.state().isPlaying).toEqual(false);
  expect(wrapper.state().playStatus).toEqual(PAUSED);
  expect(wrapper.find('.Radio-button--play').prop('src')).toContain(play);

  wrapper.find('.Radio-button--play').simulate('click');

  expect(wrapper.state().isPlaying).toEqual(true);
  expect(wrapper.state().playStatus).toEqual(PLAYING);
  expect(wrapper.find('.Radio-button--play').prop('src')).toContain(pause);
});

it('cycles tracks', () => {
  const wrapper = shallow(<Radio />);
  const { currentTrack } = wrapper.state();

  wrapper.find('.Radio-button--previous').simulate('click');

  expect(wrapper.state().currentTrack.index).toEqual(tracks.length - 1);
  expect(wrapper.state().currentTrack).not.toEqual(currentTrack);
  expect(wrapper.contains(tracks[tracks.length - 1].title)).toEqual(true);

  wrapper.find('.Radio-button--next').simulate('click');

  expect(wrapper.state().currentTrack.index).toEqual(0);
  expect(wrapper.state().currentTrack).toEqual(currentTrack);
  expect(wrapper.contains(currentTrack.title)).toEqual(true);

  wrapper.find('.Radio-button--next').simulate('click');

  expect(wrapper.state().currentTrack.index).toEqual(1);
  expect(wrapper.state().currentTrack).not.toEqual(currentTrack);
  expect(wrapper.contains(currentTrack.title)).toEqual(false);
  expect(wrapper.contains(tracks[1].title)).toEqual(true);
});
