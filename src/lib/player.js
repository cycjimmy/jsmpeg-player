import { Now, Base64ToArrayBuffer } from '../utils';

import AjaxSource from './ajax';
import AjaxProgressiveSource from './ajax-progressive';
import WSSource from './websocket';
import TS from './ts';
import MPEG1 from './mpeg1';
import MPEG1WASM from './mpeg1-wasm';
import MP2 from './mp2';
import MP2WASM from './mp2-wasm';
import WebGLRenderer from './webgl';
import CanvasRenderer from './canvas2d';
import WebAudioOut from './webaudio';
import WASMModule from './wasm-module';
import WASM_BINARY from './wasm/WASM_BINARY';

export default class Player {
  /**
   * @param url
   * @param options
   * @param hooks (play: function, pause: function, stop: function) 插入UI回调
   * @constructor
   */
  constructor(url, options = {}, hooks = {}) {
    this.options = options;

    this.hooks = hooks;
    this.options.hookOnEstablished = () => {
      if (this.hooks.load) {
        this.hooks.load();
      }
    };

    if (options.source) {
      // eslint-disable-next-line new-cap
      this.source = new options.source(url, this.options);
      options.streaming = !!this.source.streaming;
    } else if (url.match(/^wss?:\/\//)) {
      this.source = new WSSource(url, this.options);
      options.streaming = true;
    } else if (options.progressive) {
      this.source = new AjaxProgressiveSource(url, this.options);
      options.streaming = false;
    } else {
      this.source = new AjaxSource(url, this.options);
      options.streaming = false;
    }

    this.maxAudioLag = options.maxAudioLag || 0.25;
    this.loop = options.loop !== false;
    this.autoplay = !!options.autoplay || options.streaming;

    this.demuxer = new TS(options);
    this.source.connect(this.demuxer);

    if (!options.disableWebAssembly && WASMModule.IsSupported()) {
      this.wasmModule = WASMModule.GetModule();
      options.wasmModule = this.wasmModule;
    }

    if (options.video !== false) {
      this.video = options.wasmModule ? new MPEG1WASM(options) : new MPEG1(options);

      this.renderer =
        !options.disableGl && WebGLRenderer.IsSupported()
          ? new WebGLRenderer(options)
          : new CanvasRenderer(options);

      this.demuxer.connect(TS.STREAM.VIDEO_1, this.video);
      this.video.connect(this.renderer);
    }

    if (options.audio !== false && WebAudioOut.IsSupported()) {
      this.audio = options.wasmModule ? new MP2WASM(options) : new MP2(options);
      this.audioOut = new WebAudioOut(options);
      this.demuxer.connect(TS.STREAM.AUDIO_1, this.audio);
      this.audio.connect(this.audioOut);
    }

    Object.defineProperty(this, 'currentTime', {
      get: this.getCurrentTime,
      set: this.setCurrentTime
    });
    Object.defineProperty(this, 'volume', {
      get: this.getVolume,
      set: this.setVolume
    });

    this.paused = true;
    this.unpauseOnShow = false;
    if (options.pauseWhenHidden !== false) {
      document.addEventListener('visibilitychange', this.showHide.bind(this));
    }

    // If we have WebAssembly support, wait until the module is compiled before
    // loading the source. Otherwise the decoders won't know what to do with
    // the source data.
    if (this.wasmModule) {
      if (this.wasmModule.ready) {
        this.startLoading();
      } else if (WASM_BINARY) {
        const wasm = Base64ToArrayBuffer(WASM_BINARY);
        this.wasmModule.loadFromBuffer(wasm, this.startLoading.bind(this));
      } else {
        this.wasmModule.loadFromFile('jsmpeg.wasm', this.startLoading.bind(this));
      }
    } else {
      this.startLoading();
    }
  }

  startLoading() {
    this.source.start();
    if (this.autoplay) {
      this.play();
    }
  }

  showHide() {
    if (document.visibilityState === 'hidden') {
      this.unpauseOnShow = this.wantsToPlay;
      this.pause();
    } else if (this.unpauseOnShow) {
      this.play();
    }
  }

  play() {
    if (this.animationId) {
      return;
    }

    this.animationId = requestAnimationFrame(this.update.bind(this));
    this.wantsToPlay = true;
    this.paused = false;
  }

  pause() {
    if (this.paused) {
      return;
    }

    cancelAnimationFrame(this.animationId);
    this.animationId = null;
    this.wantsToPlay = false;
    this.isPlaying = false;
    this.paused = true;

    if (this.audio && this.audio.canPlay) {
      // Seek to the currentTime again - audio may already be enqueued a bit
      // further, so we have to rewind it.
      this.audioOut.stop();
      this.seek(this.currentTime);
    }

    if (this.hooks.pause) {
      this.hooks.pause();
    }

    if (this.options.onPause) {
      this.options.onPause(this);
    }
  }

  getVolume() {
    return this.audioOut ? this.audioOut.volume : 0;
  }

  setVolume(volume) {
    if (this.audioOut) {
      this.audioOut.volume = volume;
    }
  }

  stop() {
    this.pause();
    this.seek(0);
    if (this.video && this.options.decodeFirstFrame !== false) {
      this.video.decode();
    }

    if (this.hooks.stop) {
      this.hooks.stop();
    }
  }

  destroy() {
    this.pause();
    this.source.destroy();
    this.video && this.video.destroy();
    this.renderer && this.renderer.destroy();
    this.audio && this.audio.destroy();
    this.audioOut && this.audioOut.destroy();
  }

  seek(time) {
    const startOffset =
      this.audio && this.audio.canPlay ? this.audio.startTime : this.video.startTime;

    if (this.video) {
      this.video.seek(time + startOffset);
    }
    if (this.audio) {
      this.audio.seek(time + startOffset);
    }

    this.startTime = Now() - time;
  }

  getCurrentTime() {
    return this.audio && this.audio.canPlay
      ? this.audio.currentTime - this.audio.startTime
      : this.video.currentTime - this.video.startTime;
  }

  setCurrentTime(time) {
    this.seek(time);
  }

  update() {
    this.animationId = requestAnimationFrame(this.update.bind(this));

    if (!this.source.established) {
      if (this.renderer) {
        this.renderer.renderProgress(this.source.progress);
      }
      return;
    }

    if (!this.isPlaying) {
      this.isPlaying = true;
      this.startTime = Now() - this.currentTime;

      if (this.hooks.play) {
        this.hooks.play();
      }

      if (this.options.onPlay) {
        this.options.onPlay(this);
      }
    }

    if (this.options.streaming) {
      this.updateForStreaming();
    } else {
      this.updateForStaticFile();
    }
  }

  nextFrame() {
    if (this.source.established && this.video) {
      return this.video.decode();
    }
    return false;
  }

  updateForStreaming() {
    // When streaming, immediately decode everything we have buffered up until
    // now to minimize playback latency.

    if (this.video) {
      this.video.decode();
    }

    if (this.audio) {
      let decoded = false;
      do {
        // If there's a lot of audio enqueued already, disable output and
        // catch up with the encoding.
        if (this.audioOut.enqueuedTime > this.maxAudioLag) {
          this.audioOut.resetEnqueuedTime();
          this.audioOut.enabled = false;
        }
        decoded = this.audio.decode();
      } while (decoded);
      this.audioOut.enabled = true;
    }
  }

  updateForStaticFile() {
    let notEnoughData = false;
    let headroom = 0;

    // If we have an audio track, we always try to sync the video to the audio.
    // Gaps and discontinuities are far more percetable in audio than in video.

    if (this.audio && this.audio.canPlay) {
      // Do we have to decode and enqueue some more audio data?
      while (!notEnoughData && this.audio.decodedTime - this.audio.currentTime < 0.25) {
        notEnoughData = !this.audio.decode();
      }

      // Sync video to audio
      if (this.video && this.video.currentTime < this.audio.currentTime) {
        notEnoughData = !this.video.decode();
      }

      headroom = this.demuxer.currentTime - this.audio.currentTime;
    } else if (this.video) {
      // Video only - sync it to player's wallclock
      const targetTime = Now() - this.startTime + this.video.startTime;
      const lateTime = targetTime - this.video.currentTime;
      const frameTime = 1 / this.video.frameRate;

      if (this.video && lateTime > 0) {
        // If the video is too far behind (>2 frames), simply reset the
        // target time to the next frame instead of trying to catch up.
        if (lateTime > frameTime * 2) {
          this.startTime += lateTime;
        }

        notEnoughData = !this.video.decode();
      }

      headroom = this.demuxer.currentTime - targetTime;
    }

    // Notify the source of the playhead headroom, so it can decide whether to
    // continue loading further data.
    this.source.resume(headroom);

    // If we failed to decode and the source is complete, it means we reached
    // the end of our data. We may want to loop.
    if (notEnoughData && this.source.completed) {
      if (this.loop) {
        this.seek(0);
      } else {
        // this.pause();
        this.stop();

        if (this.options.onEnded) {
          this.options.onEnded(this);
        }
      }
    }

    // If there's not enough data and the source is not completed, we have
    // just stalled.
    else if (notEnoughData && this.options.onStalled) {
      this.options.onStalled(this);
    }
  }
}
