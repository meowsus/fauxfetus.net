import React from 'react';
import { Switch, Route } from 'react-router-dom';

import './Page.css';

import Home from './pages/Home';
import About from './pages/About';
import Updates from './pages/Updates';
import Contributions from './pages/Contributions';
import Artist from './pages/Artist';
import NotFound from './pages/NotFound';

function Page() {
  return (
    <div className='Page'>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/about' component={About} />
        <Route path='/updates' component={Updates} />
        <Route path='/contributions' component={Contributions} />
        <Route path='/:artist' component={Artist} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default Page;
