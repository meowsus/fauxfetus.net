import React from 'react';

function Updates() {
  return (
    <section>
      <h1>Keeping Updated</h1>
      <p>
        There are a few ways to be informed when changes are made to this site. Here they are, ordered by reliability:
      </p>
      <ol>
        <li>
          This site produces an <strong>Atom Feed</strong> that updates each time an Artist is added or updated. The URL for the feed is <a href="http://fauxfetus.net/feed.xml">http://fauxfetus.net/feed.xml</a>
        </li>
        <li>
          This site is now fully open source and hosted on Github, which means you <strong>Watch</strong> the code repository for changes. <a href="https://github.com/meowsus/fauxfetus.net/subscription">Click here</a> to subscribe
        </li>
        <li>
          Sign up to the <strong>Announce List</strong>. This is managed by my hosting provider who adheres to strict anti-spam guidelines. This means that I won't blast you with emails <em>too</em> frequently. Sign up below:
        </li>
      </ol>

      <form action="http://scripts.dreamhost.com/add_list.cgi" acceptCharset="UTF-8" method="post" target="_blank">
        <input type="hidden" name="authenticity_token" />
        <input type="hidden" name="list" value="curt@fauxfetus.net" />
        <input type="hidden" name="domain" value="fauxfetus.net" />
        <input type="text" name="email" placeholder="your@email.com" />
        <input type="submit" value="Sign Up" />
      </form>
    </section>
  );
}

export default Updates;

