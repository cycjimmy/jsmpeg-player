import { Now } from '../utils';

import BaseDecoder from './decoder';
import BitBuffer from './buffer';

export default class MPEG1WASM extends BaseDecoder {
  constructor(options) {
    super(options);

    this.onDecodeCallback = options.onVideoDecode;
    this.module = options.wasmModule;

    this.bufferSize = options.videoBufferSize || 512 * 1024;
    this.bufferMode = options.streaming ? BitBuffer.MODE.EVICT : BitBuffer.MODE.EXPAND;

    this.decodeFirstFrame = options.decodeFirstFrame !== false;
    this.hasSequenceHeader = false;
  }

  initializeWasmDecoder() {
    if (!this.module.instance) {
      console.warn('JSMpeg: WASM module not compiled yet');
      return;
    }
    this.instance = this.module.instance;
    this.functions = this.module.instance.exports;
    this.decoder = this.functions._mpeg1_decoder_create(this.bufferSize, this.bufferMode);
  }

  destroy() {
    if (!this.decoder) {
      return;
    }
    this.functions._mpeg1_decoder_destroy(this.decoder);
  }

  bufferGetIndex() {
    if (!this.decoder) {
      return;
    }
    return this.functions._mpeg1_decoder_get_index(this.decoder);
  }

  bufferSetIndex(index) {
    if (!this.decoder) {
      return;
    }
    this.functions._mpeg1_decoder_set_index(this.decoder, index);
  }

  bufferWrite(buffers) {
    if (!this.decoder) {
      this.initializeWasmDecoder();
    }

    let totalLength = 0;
    for (let i = 0; i < buffers.length; i++) {
      totalLength += buffers[i].length;
    }

    let ptr = this.functions._mpeg1_decoder_get_write_ptr(this.decoder, totalLength);
    for (let i = 0; i < buffers.length; i++) {
      this.instance.heapU8.set(buffers[i], ptr);
      ptr += buffers[i].length;
    }

    this.functions._mpeg1_decoder_did_write(this.decoder, totalLength);
    return totalLength;
  }

  write(pts, buffers) {
    BaseDecoder.prototype.write.call(this, pts, buffers);

    if (
      !this.hasSequenceHeader &&
      this.functions._mpeg1_decoder_has_sequence_header(this.decoder)
    ) {
      this.loadSequnceHeader();
    }
  }

  loadSequnceHeader() {
    this.hasSequenceHeader = true;
    this.frameRate = this.functions._mpeg1_decoder_get_frame_rate(this.decoder);
    this.codedSize = this.functions._mpeg1_decoder_get_coded_size(this.decoder);

    if (this.destination) {
      const w = this.functions._mpeg1_decoder_get_width(this.decoder);
      const h = this.functions._mpeg1_decoder_get_height(this.decoder);
      this.destination.resize(w, h);
    }

    if (this.decodeFirstFrame) {
      this.decode();
    }
  }

  decode() {
    const startTime = Now();

    if (!this.decoder) {
      return false;
    }

    const didDecode = this.functions._mpeg1_decoder_decode(this.decoder);
    if (!didDecode) {
      return false;
    }

    // Invoke decode callbacks
    if (this.destination) {
      const ptrY = this.functions._mpeg1_decoder_get_y_ptr(this.decoder);
      const ptrCr = this.functions._mpeg1_decoder_get_cr_ptr(this.decoder);
      const ptrCb = this.functions._mpeg1_decoder_get_cb_ptr(this.decoder);

      const dy = this.instance.heapU8.subarray(ptrY, ptrY + this.codedSize);
      const dcr = this.instance.heapU8.subarray(ptrCr, ptrCr + (this.codedSize >> 2));
      const dcb = this.instance.heapU8.subarray(ptrCb, ptrCb + (this.codedSize >> 2));

      this.destination.render(dy, dcr, dcb, false);
    }

    this.advanceDecodedTime(1 / this.frameRate);

    const elapsedTime = Now() - startTime;
    if (this.onDecodeCallback) {
      this.onDecodeCallback(this, elapsedTime);
    }
    return true;
  }
}
