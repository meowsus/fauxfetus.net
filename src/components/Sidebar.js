import React from 'react';
import { Link } from 'react-router-dom';

import './Sidebar.css';

function Sidebar() {
  return (
    <aside className='Sidebar'>
      <ul className='Header-menu'>
        <li>
          <Link to='/about'>About</Link>
        </li>
        <li>
          <Link to='/updates'>Updates</Link>
        </li>
        <li>
          <Link to='/contributions'>Contributions</Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;

