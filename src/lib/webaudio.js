import { Now } from '../utils';

class WebAudioOut {
  constructor() {
    this.context = WebAudioOut.CachedContext = WebAudioOut.CachedContext
      || new (window.AudioContext || window.webkitAudioContext)();

    this.gain = this.context.createGain();
    this.destination = this.gain;

    // Keep track of the number of connections to this AudioContext, so we
    // can safely close() it when we're the only one connected to it.
    this.gain.connect(this.context.destination);
    this.context._connections = (this.context._connections || 0) + 1;

    this.startTime = 0;
    this.buffer = null;
    this.wallclockStartTime = 0;
    this.volume = 1;
    this.enabled = true;

    this.unlocked = !WebAudioOut.NeedsUnlocking();

    Object.defineProperty(this, 'enqueuedTime', { get: this.getEnqueuedTime });
  }

  destroy() {
    this.gain.disconnect();
    this.context._connections--;

    if (this.context._connections === 0) {
      this.context.close();
      WebAudioOut.CachedContext = null;
    }
  }

  play(sampleRate, left, right) {
    if (!this.enabled) {
      return;
    }

    // If the context is not unlocked yet, we simply advance the start time
    // to "fake" actually playing audio. This will keep the video in sync.
    if (!this.unlocked) {
      const ts = Now();
      if (this.wallclockStartTime < ts) {
        this.wallclockStartTime = ts;
      }
      this.wallclockStartTime += left.length / sampleRate;
      return;
    }

    this.gain.gain.value = this.volume;

    const buffer = this.context.createBuffer(2, left.length, sampleRate);
    buffer.getChannelData(0).set(left);
    buffer.getChannelData(1).set(right);

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.destination);

    const now = this.context.currentTime;
    const { duration } = buffer;
    if (this.startTime < now) {
      this.startTime = now;
      this.wallclockStartTime = Now();
    }

    source.start(this.startTime);
    this.startTime += duration;
    this.wallclockStartTime += duration;
  }

  stop() {
    // Meh; there seems to be no simple way to get a list of currently
    // active source nodes from the Audio Context, and maintaining this
    // list ourselfs would be a pain, so we just set the gain to 0
    // to cut off all enqueued audio instantly.
    this.gain.gain.value = 0;
  }

  getEnqueuedTime() {
    // The AudioContext.currentTime is only updated every so often, so if we
    // want to get exact timing, we need to rely on the system time.
    return Math.max(this.wallclockStartTime - Now(), 0);
  }

  resetEnqueuedTime() {
    this.startTime = this.context.currentTime;
    this.wallclockStartTime = Now();
  }

  unlock(callback) {
    if (this.unlocked) {
      if (callback) {
        callback();
      }
      return;
    }

    this.unlockCallback = callback;

    // Create empty buffer and play it
    const buffer = this.context.createBuffer(1, 1, 22050);
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.destination);

    // polyfill source.start(0);
    if (source.start) {
      source.start(0);
    } else {
      source.noteOn(0);
    }

    setTimeout(this.checkIfUnlocked.bind(this, source, 0), 0);
  }

  checkIfUnlocked(source, attempt) {
    if (
      source.playbackState === source.PLAYING_STATE
      || source.playbackState === source.FINISHED_STATE
    ) {
      this.unlocked = true;
      if (this.unlockCallback) {
        this.unlockCallback();
        this.unlockCallback = null;
      }
    } else if (attempt < 10) {
      // Jeez, what a shit show. Thanks iOS!
      setTimeout(this.checkIfUnlocked.bind(this, source, attempt + 1), 100);
    }
  }

  static NeedsUnlocking() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  static IsSupported() {
    return window.AudioContext || window.webkitAudioContext;
  }
}

WebAudioOut.CachedContext = null;

export default WebAudioOut;
