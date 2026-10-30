// Regression tests for the AudioContext unlock handling in src/lib/webaudio.js.
//
// The module imports `Now` from ../utils, which reaches the DOM and the SCSS
// theme, so it cannot be imported as is under Node. The source is loaded with
// that single import replaced by an equivalent implementation instead of
// adding a test-only entry point to the library.
//
// The tests only look at what an owner can observe (which buffers are scheduled
// and when), so the internal recovery steps may change without rewriting them.

/* eslint-disable max-classes-per-file, class-methods-use-this */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { beforeEach, describe, it } from 'node:test';

const FRAME = 1152;
const RATE = 44100;
const FRAME_TIME = FRAME / RATE;

// A frozen until advanced clock keeps the timing assertions deterministic.
let clock = 0;
const advance = (seconds) => { clock += seconds; };

const scheduled = [];
const stopped = [];
const listeners = [];

class FakeBuffer {
  constructor(channels, length, sampleRate) {
    this.duration = length / sampleRate;
    this.data = [...Array(channels)].map(() => new Float32Array(length));
  }

  getChannelData(index) {
    return this.data[index];
  }
}

class FakeSource {
  constructor() {
    this.finished = false;
    this.onended = null;
  }

  connect() {}

  disconnect() {}

  start(time) {
    this.startTime = time;
    scheduled.push(time);
  }

  stop() {
    if (this.finished) {
      throw new Error('InvalidStateError: the source has already ended');
    }
    this.finished = true;
    stopped.push(this);
  }
}

class FakeAudioContext {
  constructor() {
    // Chrome keeps a context created without a user gesture suspended, and its
    // clock does not advance until it is resumed.
    this.state = FakeAudioContext.startRunning ? 'running' : 'suspended';
    this.destination = { name: 'destination' };
    this.runningSince = FakeAudioContext.startRunning ? clock : null;
    this.canResume = true;
    this._connections = 0;
  }

  get currentTime() {
    return this.runningSince === null ? 0 : clock - this.runningSince;
  }

  start() {
    this.state = 'running';
    this.runningSince = clock;
  }

  resume() {
    if (!this.canResume) {
      return Promise.reject(new Error('NotAllowedError: no user gesture'));
    }

    return Promise.resolve().then(() => {
      if (this.state === 'suspended') {
        this.start();
      }
    });
  }

  close() {
    this.state = 'closed';
  }

  createGain() {
    return { gain: { value: 1 }, connect() {}, disconnect() {} };
  }

  createBuffer(channels, length, sampleRate) {
    return new FakeBuffer(channels, length, sampleRate);
  }

  createBufferSource() {
    return new FakeSource();
  }
}

globalThis.window = { performance, AudioContext: FakeAudioContext };

const setUserAgent = (userAgent) => {
  Object.defineProperty(globalThis, 'navigator', { value: { userAgent }, configurable: true });
};

// The gesture listeners registered by the module are collected here so a test
// can dispatch a gesture without a DOM.
const resetDocument = () => {
  listeners.length = 0;
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: {
      addEventListener(type, handler, capture) {
        listeners.push({ type, handler, capture });
      },
      removeEventListener(type, handler) {
        const index = listeners.findIndex((l) => l.type === type && l.handler === handler);
        if (index !== -1) {
          listeners.splice(index, 1);
        }
      },
    },
  });
};

const dispatchGesture = (type = 'pointerdown') => {
  listeners.filter((l) => l.type === type).forEach((l) => l.handler());
};

const source = readFileSync(new URL('../src/lib/webaudio.js', import.meta.url), 'utf8')
  .replace(
    "import { Now } from '../utils';",
    'const Now = () => globalThis.performance.now() / 1000;',
  );

// `performance` is replaced by the frozen clock, so Now() follows `clock`.
Object.defineProperty(globalThis, 'performance', {
  configurable: true,
  value: { now: () => clock * 1000 },
});

const { default: WebAudioOut } = await import(
  `data:text/javascript;base64,${Buffer.from(`${source}\n// ${Date.now()}`).toString('base64')}`
);

const CHROME = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/114.0.0.0';
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15';

const playFrames = (audioOut, count = 1) => {
  for (let i = 0; i < count; i++) {
    audioOut.play(RATE, new Float32Array(FRAME), new Float32Array(FRAME));
  }
};

const nextTick = () => new Promise((resolve) => { setTimeout(resolve, 20); });

describe('WebAudioOut unlock handling', () => {
  beforeEach(() => {
    clock = 0;
    scheduled.length = 0;
    stopped.length = 0;
    WebAudioOut.CachedContext = null;
    FakeAudioContext.startRunning = false;
    setUserAgent(CHROME);
    resetDocument();
  });

  it('does not schedule anything while the context is suspended', () => {
    const audioOut = new WebAudioOut();

    assert.equal(audioOut.context.state, 'suspended');
    assert.equal(audioOut.unlocked, false);

    playFrames(audioOut, 40);

    // Buffers queued against a suspended context would all start at ~0 once it
    // resumes, which is exactly the "audio is seconds behind the video" bug.
    assert.equal(scheduled.length, 0);
    assert.equal(audioOut.skippedAudio, true);
    assert.ok(audioOut.enqueuedTime > FRAME_TIME * 10);
  });

  it('plays again on its own once the audio is available', () => {
    const audioOut = new WebAudioOut();
    playFrames(audioOut, 4);

    // No help from a Player or any other owner: the output recovers by itself.
    audioOut.context.start();
    advance(1);
    playFrames(audioOut);

    assert.equal(audioOut.unlocked, true);
    assert.equal(audioOut.skippedAudio, false);
    assert.equal(scheduled.length, 1);
    assert.ok(Math.abs(scheduled[0] - 1) < 1e-9, `scheduled at ${scheduled[0]}`);
    assert.ok(audioOut.enqueuedTime <= FRAME_TIME * 1.5);
  });

  it('drops the sources that were queued before a suspension', () => {
    const audioOut = new WebAudioOut();
    audioOut.context.start();
    playFrames(audioOut, 3);

    assert.equal(audioOut.sources.length, 3);

    // A tab switch or a phone call suspends the context again.
    audioOut.context.state = 'suspended';
    playFrames(audioOut, 5);
    audioOut.context.start();
    playFrames(audioOut);

    // Nothing of the old queue may be heard again next to the new buffer.
    assert.equal(stopped.length, 3);
    assert.equal(audioOut.sources.length, 1);
  });

  it('rebuilds the time base when the context resumes after a stalled loop', () => {
    const audioOut = new WebAudioOut();
    playFrames(audioOut, 1);

    // The decode loop was stalled (hidden tab): the faked queue drained while
    // the context clock stayed frozen.
    advance(FRAME_TIME * 4);
    assert.equal(audioOut.enqueuedTime, 0);

    audioOut.context.start();
    advance(1);
    playFrames(audioOut);

    // The old start time pointed into the future of the context clock.
    assert.ok(Math.abs(scheduled[0] - 1) < 1e-9, `scheduled at ${scheduled[0]}`);
  });

  it('keeps requiring a gesture on iOS even when the context reports running', async () => {
    setUserAgent(IPHONE);
    const audioOut = new WebAudioOut();
    audioOut.context.start();

    playFrames(audioOut, 5);

    assert.equal(audioOut.unlocked, false);
    assert.equal(scheduled.length, 0);
    // iOS must not be unlocked by a random page gesture either.
    assert.equal(listeners.length, 0);

    await new Promise((resolve) => {
      audioOut.unlock(resolve);
    });

    // unlock() itself starts a silent buffer to unlock the audio pipeline.
    scheduled.length = 0;
    playFrames(audioOut);

    assert.equal(audioOut.unlocked, true);
    assert.equal(scheduled.length, 1);
  });

  it('resumes inside a user gesture on the other browsers', async () => {
    const audioOut = new WebAudioOut();

    // Chrome and desktop Safari only resume the context from within a gesture,
    // so waiting for a self-resume would leave the sound muted forever.
    assert.equal(listeners.length, 4);
    assert.equal(audioOut.context.state, 'suspended');

    dispatchGesture();
    await nextTick();

    assert.equal(audioOut.unlocked, true);
    assert.equal(listeners.length, 0);

    // unlock() starts a silent buffer of its own to unlock the pipeline.
    scheduled.length = 0;
    playFrames(audioOut, 2);
    assert.equal(scheduled.length, 2);
  });

  it('unlocks on the touch events that carry the user activation', async () => {
    const audioOut = new WebAudioOut();

    const types = listeners.map((l) => l.type);
    ['pointerdown', 'pointerup', 'keydown', 'touchend'].forEach((type) => {
      assert.ok(types.includes(type), `${type} is not listened to`);
    });

    // Chrome only grants the activation on pointerup/touchend, so a touch
    // gesture has to unlock the audio within those events.
    dispatchGesture('touchend');
    await nextTick();

    assert.equal(audioOut.unlocked, true);
    assert.equal(listeners.length, 0);
  });

  it('recovers when the context is suspended again after it was unlocked', async () => {
    const audioOut = new WebAudioOut();
    dispatchGesture();
    await nextTick();
    scheduled.length = 0;
    playFrames(audioOut, 2);
    assert.equal(scheduled.length, 2);
    assert.equal(listeners.length, 0);

    // An interruption suspends the context again, and the output starts to
    // fake the playback while it stays suspended.
    audioOut.context.state = 'suspended';
    scheduled.length = 0;
    playFrames(audioOut, 3);

    assert.equal(scheduled.length, 0);
    assert.equal(audioOut.skippedAudio, true);
    // The gesture entry point has to come back for this case.
    assert.equal(listeners.length, 4);

    dispatchGesture();
    await nextTick();
    scheduled.length = 0;
    playFrames(audioOut);

    assert.equal(audioOut.context.state, 'running');
    assert.equal(scheduled.length, 1);
  });

  it('serves the callback of a second unlock', async () => {
    const audioOut = new WebAudioOut();
    audioOut.context.start();
    playFrames(audioOut, 1);
    assert.equal(audioOut.unlocked, true);

    audioOut.context.state = 'suspended';
    playFrames(audioOut, 2);

    let calls = 0;
    await new Promise((resolve) => {
      audioOut.unlock(() => {
        calls += 1;
        resolve();
      });
    });

    // The unlock UI only reacts to the first unlock, but a caller waiting for
    // this one has to be notified.
    assert.equal(calls, 1);
    assert.equal(audioOut.context.state, 'running');
  });

  it('keeps the pending callback when a page gesture unlocks the audio', async () => {
    const audioOut = new WebAudioOut();
    audioOut.context.canResume = false;

    let unlockedCalls = 0;
    let hookCalls = 0;
    audioOut.onUnlock = () => { hookCalls += 1; };
    audioOut.unlock(() => { unlockedCalls += 1; });

    await nextTick();
    assert.equal(unlockedCalls, 0);

    // The gesture listener unlocks without a callback of its own: it must not
    // swallow the one that is still waiting.
    audioOut.context.canResume = true;
    dispatchGesture();
    await nextTick();

    assert.equal(audioOut.unlocked, true);
    assert.equal(unlockedCalls, 1);
    assert.equal(hookCalls, 1);

    // A late retry of the first request must not notify a second time.
    await new Promise((resolve) => { setTimeout(resolve, 150); });
    assert.equal(hookCalls, 1);
  });

  it('fires the unlock callback and the unlock hook once', async () => {
    const audioOut = new WebAudioOut();
    audioOut.context.canResume = false;

    let unlockedCalls = 0;
    let hookCalls = 0;
    audioOut.onUnlock = () => { hookCalls += 1; };
    audioOut.unlock(() => { unlockedCalls += 1; });

    await nextTick();
    assert.equal(audioOut.unlocked, false);
    assert.equal(unlockedCalls, 0);

    audioOut.context.start();
    await new Promise((resolve) => { setTimeout(resolve, 150); });

    assert.equal(audioOut.unlocked, true);
    assert.equal(unlockedCalls, 1);
    assert.equal(hookCalls, 1);
  });

  it('plays without unlocking when the context was created after a gesture', () => {
    FakeAudioContext.startRunning = true;
    const audioOut = new WebAudioOut();

    const unlockedInitially = audioOut.unlocked;
    playFrames(audioOut, 3);

    assert.equal(unlockedInitially, true);
    assert.equal(listeners.length, 0);
    assert.equal(scheduled.length, 3);
    assert.equal(audioOut.skippedAudio, false);
  });

  it('ignores late unlocks and playback on a destroyed player', async () => {
    const audioOut = new WebAudioOut();
    playFrames(audioOut, 3);

    audioOut.context.canResume = false;
    let unlockedCalls = 0;
    audioOut.unlock(() => { unlockedCalls += 1; });

    audioOut.destroy();
    await nextTick();

    assert.equal(unlockedCalls, 0);
    assert.equal(audioOut.unlocked, false);
    assert.equal(listeners.length, 0);

    scheduled.length = 0;
    assert.doesNotThrow(() => playFrames(audioOut, 2));
    assert.equal(scheduled.length, 0);
  });

  it('keeps another player of the shared context working after a destroy', async () => {
    const destroyedPlayer = new WebAudioOut();
    playFrames(destroyedPlayer, 3);

    destroyedPlayer.context.canResume = false;
    let unlockCalls = 0;
    destroyedPlayer.unlock(() => { unlockCalls += 1; });

    const sharedContext = destroyedPlayer.context;
    const survivor = new WebAudioOut();
    assert.equal(survivor.context, sharedContext);

    destroyedPlayer.destroy();
    await nextTick();

    // The context is still open for the survivor, but nothing of the destroyed
    // player may be resumed or scheduled any more.
    assert.equal(sharedContext.state, 'suspended');
    assert.equal(unlockCalls, 0);

    sharedContext.start();
    scheduled.length = 0;
    playFrames(survivor, 2);

    assert.equal(scheduled.length, 2);
  });

  it('drops the queue and rebuilds the time base on stop', () => {
    FakeAudioContext.startRunning = true;
    const audioOut = new WebAudioOut();
    playFrames(audioOut, 3);
    assert.equal(audioOut.sources.length, 3);

    audioOut.stop();

    // Muting the gain alone would let the queue become audible again as soon
    // as play() restores it.
    assert.equal(audioOut.sources.length, 0);
    assert.equal(stopped.length, 3);
    assert.equal(audioOut.enqueuedTime, 0);

    advance(1);
    scheduled.length = 0;
    playFrames(audioOut);

    assert.equal(scheduled.length, 1);
    assert.equal(scheduled[0], 1);
  });
});
