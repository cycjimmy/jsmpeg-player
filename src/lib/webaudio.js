import { Now } from '../utils';

// Chrome grants the user activation on pointerup/touchend, not on the
// touchstart/pointerdown that precedes them, so the touch events are paired.
const UNLOCK_EVENTS = ['pointerdown', 'pointerup', 'keydown', 'touchend'];

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
    this.sources = [];
    this.skippedAudio = false;
    this.destroyed = false;
    this.gestureListener = null;
    this.unlockCallback = null;
    this.onUnlock = null;

    this.unlocked = !WebAudioOut.NeedsUnlocking() && WebAudioOut.IsRunning(this.context);

    Object.defineProperty(this, 'enqueuedTime', { get: this.getEnqueuedTime });

    if (!this.unlocked) {
      this.listenForGesture();
    }
  }

  destroy() {
    this.destroyed = true;
    this.unlockCallback = null;
    this.onUnlock = null;
    this.removeGestureListener();
    this.stopSources();

    this.gain.disconnect();
    this.context._connections--;

    if (this.context._connections === 0) {
      this.context.close();
      WebAudioOut.CachedContext = null;
    }
  }

  play(sampleRate, left, right) {
    if (!this.enabled || this.destroyed) {
      return;
    }

    // Browsers that need no explicit unlock resume the context by themselves
    // once the page has been interacted with, so the unlock does not necessarily
    // go through unlock(). iOS keeps requiring the gesture.
    if (!this.unlocked && !WebAudioOut.NeedsUnlocking()
      && WebAudioOut.IsRunning(this.context)) {
      this.onUnlocked();
    }

    // A context that is not running, or that has not been unlocked yet, cannot
    // play anything: the browser autoplay policy keeps it suspended until the
    // page has received a user gesture, and its currentTime does not advance
    // meanwhile. Scheduling buffers against it would queue all the audio
    // decoded in the meantime and play it back from the very beginning once
    // the context resumes. We simply advance the start time to "fake"
    // actually playing audio instead. This will keep the video in sync.
    if (!this.isPlayable()) {
      this.listenForGesture();

      const ts = Now();
      if (this.wallclockStartTime < ts) {
        this.wallclockStartTime = ts;
      }
      this.wallclockStartTime += left.length / sampleRate;
      this.skippedAudio = true;
      return;
    }

    // The audio is available again: whatever was queued while it could not be
    // played is dropped and the time base is rebuilt, so the audio joins the
    // picture at the current point in time instead of staying behind it. The
    // audio decoded meanwhile is lost once, which is what keeps it in sync
    // with the picture.
    if (this.skippedAudio) {
      this.skippedAudio = false;
      this.stopSources();
      this.resetEnqueuedTime();
    }

    this.gain.gain.value = this.volume;

    const buffer = this.context.createBuffer(2, left.length, sampleRate);
    buffer.getChannelData(0).set(left);
    buffer.getChannelData(1).set(right);

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.destination);
    source.onended = () => {
      const index = this.sources.indexOf(source);
      if (index !== -1) {
        this.sources.splice(index, 1);
      }
    };
    this.sources.push(source);

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
    // Cut off everything that is still queued: the gain alone would only mute
    // the buffers that are already scheduled, and they would become audible
    // again as soon as play() restores it. The time base is rebuilt so the
    // next buffer joins the current context time instead of the old queue.
    this.gain.gain.value = 0;
    this.stopSources();
    this.resetEnqueuedTime();
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

  isPlayable() {
    return this.unlocked && WebAudioOut.IsRunning(this.context);
  }

  stopSources() {
    const { sources } = this;
    this.sources = [];

    sources.forEach((source) => {
      try {
        source.stop();
      } catch (e) {
        // The source has already ended and cannot be stopped any more.
      }

      try {
        source.disconnect();
      } catch (e) {
        // It was never connected to anything.
      }
    });
  }

  listenForGesture() {
    if (this.gestureListener || this.isPlayable() || this.destroyed
      || WebAudioOut.NeedsUnlocking() || typeof document === 'undefined') {
      return;
    }

    // Chrome and desktop Safari keep the context suspended until it is resumed
    // inside a user gesture, and they do not resume it by themselves when the
    // page is tapped somewhere else. iOS keeps requiring the unlock icon.
    this.gestureListener = () => this.unlock();
    UNLOCK_EVENTS.forEach((type) => {
      document.addEventListener(type, this.gestureListener, true);
    });
  }

  removeGestureListener() {
    if (!this.gestureListener) {
      return;
    }

    UNLOCK_EVENTS.forEach((type) => {
      document.removeEventListener(type, this.gestureListener, true);
    });
    this.gestureListener = null;
  }

  unlock(callback) {
    // Nothing to do while the audio plays; a context that was suspended again
    // still has to be resumed, and a destroyed one has nothing left to unlock.
    if (this.isPlayable() || this.destroyed || this.context.state === 'closed') {
      if (callback) {
        callback();
      }
      return;
    }

    this.unlockCallback = callback || this.unlockCallback;

    // Create empty buffer and play it, so the browsers that only start their
    // audio pipeline from within a user gesture (iOS Safari) really unlock.
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

    // Chrome and desktop Safari keep the context suspended until it is resumed
    // explicitly, and resume() only takes effect inside a user gesture - which
    // is exactly where unlock() is called from.
    let resumed = null;
    try {
      resumed = this.context.resume && this.context.resume();
    } catch (e) {
      // An unsupported or interrupted context: fall through to the polling
      // check, which also covers the browsers that resume on their own.
    }

    if (resumed && resumed.then) {
      resumed.then(
        () => this.checkIfUnlocked(source, 0),
        () => this.checkIfUnlocked(source, 0),
      );
      return;
    }

    setTimeout(this.checkIfUnlocked.bind(this, source, 0), 0);
  }

  checkIfUnlocked(source, attempt) {
    if (this.destroyed || this.context.state === 'closed') {
      // The player was destroyed while waiting for the unlock.
      this.unlockCallback = null;
      return;
    }

    // `playbackState` and its constants were removed from the Web Audio API,
    // and comparing two undefined values is always true, so the legacy check
    // may only be used when the browser actually exposes it.
    const legacyUnlocked = source.playbackState !== undefined
      && (source.playbackState === source.PLAYING_STATE
        || source.playbackState === source.FINISHED_STATE);

    const unlocked = this.context.state
      ? this.context.state === 'running'
      : legacyUnlocked;

    if (unlocked) {
      this.onUnlocked();
    } else if (attempt < 10) {
      // Jeez, what a shit show. Thanks iOS!
      setTimeout(this.checkIfUnlocked.bind(this, source, attempt + 1), 100);
    }
  }

  onUnlocked() {
    if (this.destroyed) {
      return;
    }

    this.removeGestureListener();

    // The output may be unlocked again after its context had been suspended, so
    // a pending callback is always served; only the onUnlock hook, which drives
    // the unlock UI, is limited to the first time.
    const firstUnlock = !this.unlocked;
    this.unlocked = true;

    const callbacks = [this.unlockCallback, firstUnlock ? this.onUnlock : null];
    this.unlockCallback = null;

    callbacks.forEach((callback) => {
      if (callback) {
        callback();
      }
    });
  }

  static NeedsUnlocking() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  static IsRunning(context) {
    // Old WebKit versions expose no state at all; there, NeedsUnlocking()
    // alone decides whether the context has to be unlocked.
    return !context.state || context.state === 'running';
  }

  static IsSupported() {
    return window.AudioContext || window.webkitAudioContext;
  }
}

WebAudioOut.CachedContext = null;

export default WebAudioOut;
