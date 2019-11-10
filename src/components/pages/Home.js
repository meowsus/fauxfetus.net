import React from 'react';

function Home() {
  return (
    <section>
      <h1>Recent News</h1>

      <h2>March 12th, 2018 - v0.3.0</h2>
      <p>Artist and Member lists are now alphabetized for your convenience.</p>

      <h2>February 13th, 2017 - v0.2.1</h2>
      <p>I've cleaned up a few minor issues with this release:</p>
      <ol>
        <li>Albums are now sorted by track number, like they always should have been.</li>
        <li>The Audio Players are a bit smarter than before. Now, when you switch between albums, both won't start playing at the same time... hopefully.</li>
      </ol>

      <h2>February 4th, 2017 - v0.2.0</h2>
      <p>Faux Fetus veterans will remember <a href="/people/brian-reichert.html">Brian Reichert</a> and the love/hate relationship he has with his own music. True to form, Brian has asked that his solo albums be removed from the site.</p>
      <p>In compliance with his wishes <strong>The Singing Idiot</strong>, <strong>Fun Tunnel</strong>, <strong>The Nervous System</strong> and <strong>Happybear Kaboom</strong> (with the exception of this split with Father Sleep) have been removed.</p>
      <p>There's good news, though. All of his collaborative work is still online and he's releasing his next <a href="https://nyxynyx.bandcamp.com/" target="_blank" rel="noopener noreferrer">Nyxy Nyx</a> album as a Faux Fetus Exclusive.</p>

      <h2>February 3rd, 2017 - v0.1.0</h2>
      <p>The site is reborn with a new front-end. The artist offering is the same as it was when the site went down in 2010, save for the inclusion of <a href="/artists/the-riffingtons.html">The Riffingtons</a>.</p>
      <p>The reception is well received.  We'll keep this up as long as we can.</p>
    </section>
  );
}

export default Home;

