# EOD Log

In the spirit of John Carmack's .plan files I have created this EOD Log to shut my brain up at the end of day.

I should have started this a long time ago.

## TODO

- figure out how to handle splits and comps
  - Inheritance from Album > Split/Compilation or Album > Compilation > Split
- add `Parser.warnings` for things like missing Composer field & print
- figure out members data structure
- Set up google group

### 09/25/24:

- finished & merged class-based refactor
- tag files in \_SPLITS / \_COMPS directories
- Fix Catalog: Try instantiating empty Artist & Albums with `.add` method

Y'know the feeling where you start with one refactor and it kicks off another? I do, all too well. Things were getting pretty hairy so I decided to envision the data not as objects but as classes. I mean, it makes sense, right? I'm dealing with `IAudioMetadata` from the `music-metadata` library, a subset of which should be teased out and flattened into a `Track` class.

The problem is that that's the only type of class I'm left with: a "track."

This is really the mind-bender that keeps bringing me back to this project. Could I give up and tie this all into a database much more simply? Fuckin' a, could I ever... But that's just not fun (or cost effective). The majority of the display & functional data I need is sitting on the filesystem in ID3 tags already which can be parsed into individual JSON files for request. It's a purely static site. It costs me $0 to run and it's fast as hell -- theoretically -- if I'm careful.

Anyway. The class approach felt great, but the mental fuckery comes in when thinking about iterating over a collection of `Tracks` which contain _all the data_. How might I best represent _some of the data_ and create a structure that not only makes sense but can be easily translated into a JSON file system.

Once a `Track` class was introduced, `Artist` and `Album` naturally have to follow, but you can't directly derive an album from a track, because it's intrinsically connected to an artist. So the first step always seems to be to create a nested object, keyed by artist name, then by album name, the value of which is an array of `Track`s... I guess... God damn it, I just thought of a better way to finish out the second refactor.

Speaking of, the second refactor appeared because of the shoddiness of my implementation of `Artist` and `Album` I remember thinking (two days ago, a millennia in though-time at this point) "oh, the album's constructor will receive tracks, and the artist's will receive albums." The ol' _and let God sort 'em out_ rationale. This turned out to be an abomination in the eyes of the lord, for pretty obvious reasons. Remember: the only palpable data I have is `IAudioMetadata`. End quote. Repeat the line.

Long story short `Artist.addAlbum` and `Album.addTrack` exists now, and it was a brutal culling of code to get to this point, but things make a lot more sense now, probably, for this very second, at least, maybe.
