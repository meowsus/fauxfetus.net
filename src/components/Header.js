import React from 'react';
import { Link } from 'react-router-dom';

import './Header.css';

function Header() {
  return (
    <div className='Header'>
      <Link to='/'className='Header-logo'>
        Faux Fetus
      </Link>
    </div>
  );
}

export default Header;
