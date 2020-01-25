import React from 'react';
import { Link } from 'react-router-dom';

import '../assets/styles/Header.css';

function Header() {
  return (
    <div className="Header">
      <div className="constrainer">
        <Link
          to="/"
          className="Header-logo"
        >
          FauxFetus
        </Link>
        {/* Soon
        <ul className="Header-menu">
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/updates">Updates</Link>
          </li>
          <li>
            <Link to="/contributions">Contributions</Link>
          </li>
        </ul>
        */}
      </div>
    </div>
  );
}

export default Header;
