// Based on kjmp2 by Martin J. Fiedler
// http://keyj.emphy.de/kjmp2/

import { Now } from '../utils';

import BaseDecoder from './decoder';
import BitBuffer from './buffer';

class MP2WASM extends BaseDecoder {
  constructor(options) {
    super(options);

    this.onDecodeCallback = options.onAudioDecode;
    this.module = options.wasmModule;

    this.bufferSize = options.audioBufferSize || 128 * 1024;
    this.bufferMode = options.streaming ? BitBuffer.MODE.EVICT : BitBuffer.MODE.EXPAND;

    this.sampleRate = 0;
    this.destroyed = false;
  }

  initializeWasmDecoder() {
    if (this.destroyed) {
      return;
    }

    if (!this.module.instance) {
      console.warn('JSMpeg: WASM module not compiled yet');
      return;
    }
    this.instance = this.module.instance;
    this.functions = this.module.instance.exports;
    this.decoder = this.functions._mp2_decoder_create(this.bufferSize, this.bufferMode);
  }

  destroy() {
    // A source can still deliver one last chunk inside the very callback that
    // destroys the player, so nothing may reach the module from now on.
    this.destroyed = true;

    if (!this.decoder) {
      return;
    }
    this.functions._mp2_decoder_destroy(this.decoder);
    // The pointer refers to a freed block now, and the module may hand the same
    // address to the decoder of the next player: it must never be used again.
    this.decoder = null;
    this.canPlay = false;
  }

  write(pts, buffers) {
    if (this.destroyed) {
      return;
    }

    super.write(pts, buffers);
  }

  bufferGetIndex() {
    if (!this.decoder) {
      return;
    }
    // eslint-disable-next-line consistent-return
    return this.functions._mp2_decoder_get_index(this.decoder);
  }

  bufferSetIndex(index) {
    if (!this.decoder) {
      return;
    }
    this.functions._mp2_decoder_set_index(this.decoder, index);
  }

  bufferWrite(buffers) {
    if (this.destroyed) {
      return 0;
    }

    if (!this.decoder) {
      this.initializeWasmDecoder();
    }

    if (!this.decoder) {
      // The module is not compiled yet; nothing can be written.
      return 0;
    }

    let totalLength = 0;
    for (let i = 0; i < buffers.length; i++) {
      totalLength += buffers[i].length;
    }

    let ptr = this.functions._mp2_decoder_get_write_ptr(this.decoder, totalLength);
    for (let i = 0; i < buffers.length; i++) {
      this.instance.heapU8.set(buffers[i], ptr);
      ptr += buffers[i].length;
    }

    this.functions._mp2_decoder_did_write(this.decoder, totalLength);
    return totalLength;
  }

  decode() {
    const startTime = Now();

    if (!this.decoder) {
      return false;
    }

    const decodedBytes = this.functions._mp2_decoder_decode(this.decoder);
    if (decodedBytes === 0) {
      return false;
    }

    if (!this.sampleRate) {
      this.sampleRate = this.functions._mp2_decoder_get_sample_rate(this.decoder);
    }

    if (this.destination) {
      // Create a Float32 View into the modules output channel data
      const leftPtr = this.functions._mp2_decoder_get_left_channel_ptr(this.decoder);
      const rightPtr = this.functions._mp2_decoder_get_right_channel_ptr(this.decoder);

      const leftOffset = leftPtr / Float32Array.BYTES_PER_ELEMENT;
      const rightOffset = rightPtr / Float32Array.BYTES_PER_ELEMENT;

      const left = this.instance.heapF32.subarray(
        leftOffset,
        leftOffset + MP2WASM.SAMPLES_PER_FRAME,
      );
      const right = this.instance.heapF32.subarray(
        rightOffset,
        rightOffset + MP2WASM.SAMPLES_PER_FRAME,
      );

      this.destination.play(this.sampleRate, left, right);
    }

    this.advanceDecodedTime(MP2WASM.SAMPLES_PER_FRAME / this.sampleRate);

    const elapsedTime = Now() - startTime;
    if (this.onDecodeCallback) {
      this.onDecodeCallback(this, elapsedTime);
    }
    return true;
  }

  getCurrentTime() {
    const enqueuedTime = this.destination ? this.destination.enqueuedTime : 0;
    return this.decodedTime - enqueuedTime;
  }
}

MP2WASM.SAMPLES_PER_FRAME = 1152;

export default MP2WASM;
