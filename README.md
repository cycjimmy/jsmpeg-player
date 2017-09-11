# jsmpeg-player

[![Build Status](https://travis-ci.org/cycjimmy/jsmpeg-player.svg?branch=master)](https://travis-ci.org/cycjimmy/jsmpeg-player)

* The player is based on [jsmpeg](https://github.com/phoboslab/jsmpeg).
* The video must be compressed into the TS format of MPEG1 / MP2.
* Apple device automatically plays without sound, you need to guide the user to click on the video in the lower right corner of the video icon to unlock the sound.(no similar problem in non-autoplay mode)

## Encoding Video/Audio for [jsmpeg](https://github.com/phoboslab/jsmpeg) by [ffmpeg](https://ffmpeg.org/)
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
1. Install
  ```shell
  $ npm install jsmpeg-player
  ```

2. Use ES6 import. E.g:
  ```javascript
  import JSMpeg from 'jsmpeg-player';
  ```

3. Init JSMpeg
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

