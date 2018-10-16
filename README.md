# JSMpeg Player(TS Player)

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![David deps][david-image]][david-url]
[![devDependencies Status][david-dev-image]][david-dev-url]
[![npm download][download-image]][download-url]
[![jsdelivr][jsdelivr-image]][jsdelivr-url]
[![npm license][license-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/jsmpeg-player.svg?style=flat-square
[npm-url]: https://npmjs.org/package/jsmpeg-player
[travis-image]: https://img.shields.io/travis/cycdpo/jsmpeg-player.svg?style=flat-square
[travis-url]: https://travis-ci.org/cycdpo/jsmpeg-player
[david-image]: https://img.shields.io/david/cycdpo/jsmpeg-player.svg?style=flat-square
[david-url]: https://david-dm.org/cycdpo/jsmpeg-player
[david-dev-image]: https://david-dm.org/cycdpo/jsmpeg-player/dev-status.svg?style=flat-square
[david-dev-url]: https://david-dm.org/cycdpo/jsmpeg-player?type=dev
[download-image]: https://img.shields.io/npm/dm/jsmpeg-player.svg?style=flat-square
[download-url]: https://npmjs.org/package/jsmpeg-player
[jsdelivr-image]: https://data.jsdelivr.com/v1/package/npm/jsmpeg-player/badge
[jsdelivr-url]: https://www.jsdelivr.com/package/npm/jsmpeg-player
[license-image]: https://img.shields.io/npm/l/jsmpeg-player.svg?style=flat-square

* JSMpeg player is based on [jsmpeg](https://github.com/phoboslab/jsmpeg).
* The video must be compressed into the TS format of MPEG1 / MP2.
* Apple device automatically plays without sound, you need to guide the user to click on the video in the lower right corner of the video icon to unlock the sound. (no similar problem in non-autoplay mode)

[Releases](https://github.com/cycdpo/jsmpeg-player/releases) | [Demo](https://cycdpo.github.io/jsmpeg-player/)

## How to use
### Install
  ```shell
  $ npm install jsmpeg-player --save
  # or
  $ yarn add jsmpeg-player
  ```

### Usage
  ```javascript
  import JSMpeg from 'jsmpeg-player';
  # OR
  let JSMpeg = require('jsmpeg-player');
  ```

  ```javascript
  new JSMpeg.VideoElement(videoWrapper, videoUrl, [, options])
  ```

* `videoWrapper`: [String | Element] The wrapper of the video. Height and width of wrapper must be initialized.
* `videoUrl`: [String] A URL to an MPEG .ts file
* The `options` support:
  * `poster`: [String] URL to an image to use as the poster to show before the video plays. (Recommended to set it manually)
  * `autoplay`: [Boolean] Whether to start playing immediately. Default `false`.
  * `loop`: [Boolean] Whether to loop the video (static files only). Default `false`.**[overwrite]**
  * `aspectPercent`: [String] Aspect ratio converted to percentage. E.g: '16:9' => `'56.25%'`. Default `'56.25%'`.
  * `picMode`: [Boolean] Picture mode (no playButton). Default `false`.
  * `chunkSize` [Number] The chunk size in bytes to load at a time. Default `1024*1024` (1mb).
  * `hookInPlay`: [Function] The hook function when the video play.
  * `hookInPause`: [Function] The hook function when the video pause.
  * `hookInStop`: [Function] The hook function when the video stop.
  * More options can view the [jsmpeg options](https://github.com/phoboslab/jsmpeg#usage)

* `JSMpeg.VideoElement` instance supports the following methods:
  * `destroy()`: Empty video wrapper.
* `JSMpeg.VideoElement.player` instance API can view the [JSMpeg.Player API](https://github.com/phoboslab/jsmpeg#jsmpegplayer-api)

### Use in browser
```html
<div id="videoWrapper"></div>
<script src="JSMpeg.min.js"></script>
<script>
  var videoUrl = '../static/media/test_video.ts';
  new JSMpeg.VideoElement('#videoWrapper', videoUrl);
</script>
```

## CDN
To use via a CDN include this in your HTML:
```text
<script src="https://cdn.jsdelivr.net/npm/jsmpeg-player@1/build/JSMpeg.min.js"></script>
```

## Encoding Video/Audio for [jsmpeg](https://github.com/phoboslab/jsmpeg) by [ffmpeg](https://ffmpeg.org/). E.g:
```shell
$ ffmpeg -i input.mp4 -f mpegts
         -codec:v mpeg1video -s 640x360 -b:v 700k -r 25 -bf 0
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
