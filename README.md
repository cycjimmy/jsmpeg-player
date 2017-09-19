# JSMpeg Player(TS Player)

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![David deps][david-image]][david-url]
[![devDependencies Status][david-dev-image]][david-dev-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]
[![npm license][license-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/jsmpeg-player.svg?style=flat-square
[npm-url]: https://npmjs.org/package/jsmpeg-player
[travis-image]: https://img.shields.io/travis/cycjimmy/jsmpeg-player.svg?style=flat-square
[travis-url]: https://travis-ci.org/cycjimmy/jsmpeg-player
[david-image]: https://img.shields.io/david/cycjimmy/jsmpeg-player.svg?style=flat-square
[david-url]: https://david-dm.org/cycjimmy/jsmpeg-player
[david-dev-image]: https://david-dm.org/cycjimmy/jsmpeg-player/dev-status.svg?style=flat-square
[david-dev-url]: https://david-dm.org/cycjimmy/jsmpeg-player?type=dev
[node-image]: https://img.shields.io/badge/node.js-%3E=_4.0-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/jsmpeg-player.svg?style=flat-square
[download-url]: https://npmjs.org/package/jsmpeg-player
[license-image]: https://img.shields.io/npm/l/jsmpeg-player.svg?style=flat-square

* JSMpeg player is based on [jsmpeg](https://github.com/phoboslab/jsmpeg).
* The video must be compressed into the TS format of MPEG1 / MP2.
* Apple device automatically plays without sound, you need to guide the user to click on the video in the lower right corner of the video icon to unlock the sound.(no similar problem in non-autoplay mode)

## Encoding Video/Audio for [jsmpeg](https://github.com/phoboslab/jsmpeg) by [ffmpeg](https://ffmpeg.org/). E.g:
```shell
$ ffmpeg -i input.mp4 -f mpegts
         -codec:v mpeg1video -s 640x360 -b:v 600k -r 25 -bf 0
         -codec:a mp2 -ar 44100 -ac 1 -b:a 64k
         output.ts
```

* options
  * `-s`: video size
  * `-b:v`: video bit rate
  * `-r`: frame rate
  * `-ar`: sampling rate
  * `-ac`: number of audio channels
  * `-b:a`: audio bit rate

## How to use
### Install
  ```shell
  $ npm install jsmpeg-player --save
  # or
  $ yarn add jsmpeg-player
  ```

### How To Use
  ```javascript
  import * as JSMpeg from 'jsmpeg-player';
  ```

  ```javascript
  let JSMpeg = require('jsmpeg-player');
  ```

  ```javascript
  let
    // Html Element for videoWrapper.
    videoWrapper = document.getElementById('videoWrapper')
    , videoUrl = '../static/media/test_video.ts'
  ;

  new JSMpeg.VideoElement(videoWrapper, videoUrl, {
    // the poster of video(Recommended to set it manually)
    poster: '../static/images/screenshot_test.jpg',

    // Aspect ratio converted to percentage.
    // E.g: '16:9' => '56.25%'
    // default: '56.25%'
    aspectPercent: '56.25%',

    // picture node (no playButton)
    // default: false
    picMode: true,

    // The player sets the hook when playing/pause/stop
    hookInPlay: () => {},
    hookInPause: () => {},
    hookInStop: () => {},

    // other options are the same as JSMpeg.Player
    // https://github.com/phoboslab/jsmpeg
  })
  ```

### Use in browser
```html
<script src="../dist/JSMpeg.min.js"></script>
<script>
  var
    videoWrapper = document.getElementById('testVideo')
    , videoUrl = '../static/media/test_video.ts'
  ;

  new JSMpeg.VideoElement(videoWrapper, videoUrl, {});
</script>
```

