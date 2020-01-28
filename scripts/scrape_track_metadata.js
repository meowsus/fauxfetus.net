/**
 * Metadata dumped in the following format from `parseFile`:
 *
 * {
 *   format: {
 *     tagTypes: [ 'ID3v2.3' ],
 *     lossless: false,
 *     container: 'MPEG',
 *     codec: 'MP3',
 *     sampleRate: 44100,
 *     numberOfChannels: 2,
 *     bitrate: 160000,
 *     tool: 'LAME 3.96\u0000\u0000',
 *     codecProfile: 'CBR',
 *     numberOfSamples: 381312,
 *     duration: 8.646530612244899
 *   },
 *   native: undefined,
 *   quality: { warnings: [] },
 *   common: {
 *     track: { no: 1, of: null },
 *     disk: { no: null, of: null },
 *     title: 'Untitled',
 *     artists: [ 'ZZ Pot' ],
 *     artist: 'ZZ Pot',
 *     album: 'ZZ Pot I'
 *   }
 * }
 */

const fs = require('fs');
const path = require('path');
const musicMetadata = require('music-metadata');

const sluggerize = (string) => {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');

  return string.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word characters
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

const formatTrackData = (data, file) => ({
  file: file.replace(/^public/, ''),
  title: data.common.title,
  album: data.common.album,
  artist: data.common.artist,
  titleSlug: sluggerize(data.common.title),
  artistSlug: sluggerize(data.common.artist),
  albumSlug: sluggerize(data.common.album),
  extra: {
    sampleRate: data.format.sampleRate,
    bitrate: data.format.bitrate,
    codecProfile: data.format.codecProfile,
    duration: data.format.duration,
    trackNumber: data.common.track.no,
  },
});

class ID3Scraper {
  constructor(audioDir) {
    this.audioDir = audioDir;
    this.audioFiles = this.findAudioFiles(audioDir);

    this.data = {};

    this.saveFiles = {
      catalog: './public/data/catalog.json',
      tracks: './public/data/tracks.json',
    };
  }

  findAudioFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const fileStat = fs.lstatSync(filePath);

      if (fileStat.isDirectory()) {
        this.findAudioFiles(filePath, fileList);
      } else if ((/\.mp3$/).test(filePath)) {
        fileList.push(filePath);
      }
    });

    return fileList;
  }

  getMetadata() {
    return Promise.all(
      this.audioFiles.map((file) => (
        musicMetadata.parseFile(file).then((data) => (
          formatTrackData(data, file)
        ))
      )),
    );
  }

  storeArtist(metadata) {
    const { artistSlug, artist } = metadata;

    if (this.data[artistSlug]) { return; }

    this.data[artistSlug] = {
      name: artist,
      albums: {},
    };
  }

  storeAlbum(metadata) {
    const { artistSlug, albumSlug, album } = metadata;

    if (this.data[artistSlug].albums[albumSlug]) { return; }

    this.data[artistSlug].albums[albumSlug] = {
      name: album,
      tracks: [],
    };
  }

  storeTrack(metadata) {
    const {
      artistSlug,
      albumSlug,
      titleSlug,
      file,
      title,
      extra,
    } = metadata;

    this.data[artistSlug].albums[albumSlug].tracks = (
      (this.data[artistSlug].albums[albumSlug].tracks || [])
    );

    this.data[artistSlug].albums[albumSlug].tracks.push({
      file,
      title,
      titleSlug,
      extra,
    });
  }

  saveCatalogFile() {
    fs.writeFileSync(this.saveFiles.catalog, JSON.stringify(this.data));
  }

  saveTracksFile() {
    const data = (
      Object.values(this.data).flatMap((artist) => (
        Object.values(artist.albums).flatMap((album) => (
          album.tracks.map((tracks) => ({
            ...tracks,
            artist: artist.name,
            album: album.name,
          }))
        ))
      )).reduce((group, track) => {
        group.push({
          title: track.title,
          artist: track.artist,
          album: track.album,
          file: track.file,
        });

        return group;
      }, [])
    );

    fs.writeFileSync(this.saveFiles.tracks, JSON.stringify(data));
  }

  perform() {
    this.getMetadata().then((data) => {
      data.forEach((metadata) => {
        this.storeArtist(metadata);
        this.storeAlbum(metadata);
        this.storeTrack(metadata);
      });

      this.saveCatalogFile();
      this.saveTracksFile();
    });
  }
}

(new ID3Scraper('./public/audio/')).perform();
