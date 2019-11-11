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

const outFile = './src/tracks.json';
fs.writeFileSync(outFile, JSON.stringify([]), { flags: 'a' });

function findInDir (dir, filter, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const fileStat = fs.lstatSync(filePath);

    if (fileStat.isDirectory()) {
      findInDir(filePath, filter, fileList);
    } else if (filter.test(filePath)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function appendToFile (metadata, file) {
  const content = fs.readFileSync(outFile);
  let json = JSON.parse(content);

  json.push({
    //sampleRate: metadata.format.sampleRate,
    //bitrate: metadata.format.bitrate,
    //codecProfile: metadata.format.codecProfile,
    //numberOfSamples: metadata.format.numberOfSamples,
    //duration: metadata.format.duration,
    //trackNo: metadata.common.track.no,
    title: metadata.common.title,
    artist: metadata.common.artist,
    album: metadata.common.album,
    file: file.replace(/^public/, ''),
  });

  fs.writeFileSync(outFile, JSON.stringify(json));
}

const files = findInDir('./public/audio/', /\.mp3$/);
files.forEach((file) => {
  musicMetadata.parseFile(file).then((metadata) => {
    appendToFile(metadata, file);
  });
});
