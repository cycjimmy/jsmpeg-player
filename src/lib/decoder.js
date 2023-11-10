/* eslint class-methods-use-this: ["error", { "exceptMethods": ["destroy"] }] */
export default class BaseDecoder {
  constructor(options) {
    this.destination = null;
    this.canPlay = false;

    this.collectTimestamps = !options.streaming;
    this.bytesWritten = 0;
    this.timestamps = [];
    this.timestampIndex = 0;

    this.startTime = 0;
    this.decodedTime = 0;

    Object.defineProperty(this, 'currentTime', { get: this.getCurrentTime });
  }

  destroy() {}

  connect(destination) {
    this.destination = destination;
  }

  bufferGetIndex() {
    return this.bits.index;
  }

  bufferSetIndex(index) {
    this.bits.index = index;
  }

  bufferWrite(buffers) {
    return this.bits.write(buffers);
  }

  write(pts, buffers) {
    if (this.collectTimestamps) {
      if (this.timestamps.length === 0) {
        this.startTime = pts;
        this.decodedTime = pts;
      }
      this.timestamps.push({ index: this.bytesWritten << 3, time: pts });
    }

    this.bytesWritten += this.bufferWrite(buffers);
    this.canPlay = true;
  }

  seek(time) {
    if (!this.collectTimestamps) {
      return;
    }

    this.timestampIndex = 0;
    for (let i = 0; i < this.timestamps.length; i++) {
      if (this.timestamps[i].time > time) {
        break;
      }
      this.timestampIndex = i;
    }

    const ts = this.timestamps[this.timestampIndex];
    if (ts) {
      this.bufferSetIndex(ts.index);
      this.decodedTime = ts.time;
    } else {
      this.bufferSetIndex(0);
      this.decodedTime = this.startTime;
    }
  }

  decode() {
    this.advanceDecodedTime(0);
  }

  advanceDecodedTime(seconds) {
    if (this.collectTimestamps) {
      let newTimestampIndex = -1;
      const currentIndex = this.bufferGetIndex();
      for (let i = this.timestampIndex; i < this.timestamps.length; i++) {
        if (this.timestamps[i].index > currentIndex) {
          break;
        }
        newTimestampIndex = i;
      }

      // Did we find a new PTS, different from the last? If so, we don't have
      // to advance the decoded time manually and can instead sync it exactly
      // to the PTS.
      if (newTimestampIndex !== -1 && newTimestampIndex !== this.timestampIndex) {
        this.timestampIndex = newTimestampIndex;
        this.decodedTime = this.timestamps[this.timestampIndex].time;
        return;
      }
    }

    this.decodedTime += seconds;
  }

  getCurrentTime() {
    return this.decodedTime;
  }
}
