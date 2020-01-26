import React from 'react';
import { mount } from 'enzyme';

import App from '../App';

it('renders the entire app without crashing', () => {
  mount(<App />);
});
