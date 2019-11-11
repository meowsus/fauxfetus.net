import React from 'react';
import { Switch, Route } from 'react-router-dom';

import './Page.css';

import Home from './pages/Home';
import About from './pages/About';
import Updates from './pages/Updates';
import Contributions from './pages/Contributions';

function Page() {
  return (
    <div className='Page'>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/about' component={About} />
        <Route path='/updates' component={Updates} />
        <Route path='/contributions' component={Contributions} />
      </Switch>
    </div>
  );
}

export default Page;
