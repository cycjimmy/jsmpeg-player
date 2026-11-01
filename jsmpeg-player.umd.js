;(function(){try{if(typeof document!='undefined'){var e=document.createElement('style');e.appendChild(document.createTextNode(".style-module__canvas,.style-module__poster,.style-module__play-button,.style-module__unmute-button{z-index:1;width:100%;height:100%;position:absolute;top:0;left:0}.style-module__play-button{justify-content:center;align-items:center;display:flex}.style-module__canvas,.style-module__poster{display:block}.style-module__poster.style-module__hidden{display:none}.style-module__unmute-button,.style-module__play-button{cursor:pointer;opacity:.7;-webkit-tap-highlight-color:rgba(255,0,0,0)}.style-module__hidden.style-module__unmute-button,.style-module__hidden.style-module__play-button{display:none}.style-module__play-button{z-index:10}.style-module__play-button>svg{fill:#fff;width:12vw;max-width:60px;height:12vw;max-height:60px}.style-module__unmute-button{z-index:10;justify-content:flex-end;align-items:flex-end;display:flex}.style-module__unmute-button>svg{fill:#fff;width:9vw;max-width:40px;height:9vw;max-height:40px;margin:0 15px 15px 0}"));document.head.appendChild(e)}}catch(t){console.error('inject-css',t)}})();
(function(global, factory) {
	typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define([], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.JSMpeg = factory());
})(this, function() {
	// src/lib/ajax.js
	var AjaxSource = class {
		constructor(url, options) {
			this.url = url;
			this.destination = null;
			this.request = null;
			this.streaming = false;
			this.completed = false;
			this.established = false;
			this.progress = 0;
			this.onEstablishedCallback = options.onSourceEstablished;
			this.onCompletedCallback = options.onSourceCompleted;
			if (options.hookOnEstablished) this.hookOnEstablished = options.hookOnEstablished;
		}
		connect(destination) {
			this.destination = destination;
		}
		start() {
			this.request = new XMLHttpRequest();
			this.request.onreadystatechange = function() {
				if (this.request.readyState === this.request.DONE && this.request.status === 200) this.onLoad(this.request.response);
			}.bind(this);
			this.request.onprogress = this.onProgress.bind(this);
			this.request.open("GET", this.url);
			this.request.responseType = "arraybuffer";
			this.request.send();
		}
		resume() {}
		destroy() {
			if (!this.request) return;
			this.request.abort();
		}
		onProgress(ev) {
			this.progress = ev.loaded / ev.total;
		}
		onLoad(data) {
			this.established = true;
			this.completed = true;
			this.progress = 1;
			if (this.hookOnEstablished) this.hookOnEstablished();
			if (this.onEstablishedCallback) this.onEstablishedCallback(this);
			if (this.onCompletedCallback) this.onCompletedCallback(this);
			if (this.destination) this.destination.write(data);
		}
	};
	// node_modules/@cycjimmy/awesome-js-funcs/esm/judgeBasic/isString.js
	/**
	* determine a string type
	* @param str
	* @returns {boolean}
	*/
	var isString_default = (str) => typeof str === "string" && str.constructor === String;
	// node_modules/@cycjimmy/awesome-js-funcs/esm/judgeBasic/isPromise.js
	/**
	* determine a promise type
	* @param promise
	* @returns {boolean}
	*/
	var isPromise_default = (promise) => Object.prototype.toString.call(promise).slice(8, -1) === "Promise";
	// node_modules/@cycjimmy/awesome-js-funcs/esm/typeConversion/functionToPromise.js
	/**
	* function to promise
	* @param normalFunction
	* @param timeout
	* @returns {Promise<any>}
	*/
	var functionToPromise_default = (function(normalFunction) {
		var timeout = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
		if (isPromise_default(normalFunction)) return normalFunction;
		return new Promise((resolve) => {
			normalFunction();
			setTimeout(resolve, timeout);
		});
	});
	// src/buttonView.js
	/**
	* PLAY_BUTTON HTML
	* @type {string}
	*/
	var PLAY_BUTTON = `
<svg viewBox="0 0 64 64">
  <path d="M26,45.5L44,32L26,18.6v27V45.5L26,45.5z M32,2C15.4,2,2,15.5,2,32c0,16.6,13.4,30,30,30c16.6,0,30-13.4,30-30 C62,15.4,48.5,2,32,2L32,2z M32,56c-9.7,0-18.5-5.9-22.2-14.8C6.1,32.2,8.1,21.9,15,15c6.9-6.9,17.2-8.9,26.2-5.2 C50.1,13.5,56,22.3,56,32C56,45.3,45.2,56,32,56L32,56z"/>
</svg>
`;
	/**
	* UNMUTE_BUTTON HTML
	* @type {string}
	*/
	var UNMUTE_BUTTON = `
<svg viewBox="0 0 64 64">
  <path d="M58.3,45.5l-4.8-4.3c1.4-2.9,2.2-6.2,2.2-9.6c0-11.1-8.2-20.3-18.9-21.9V3.3C50.9,4.9,62,16.9,62,31.6 C62,36.6,60.6,41.4,58.3,45.5L58.3,45.5z M30.4,5.6v15.2l-8.3-7.3L30.4,5.6L30.4,5.6z M36.7,19.9c4.6,1.9,7.9,6.4,7.9,11.7 c0,0.6-0.1,1.1-0.1,1.7l-7.8-6.9V19.9L36.7,19.9z M57.5,60.7l-7.1-6.3c-3.9,2.9-8.6,4.8-13.7,5.4v-6.4c3.2-0.5,6.2-1.7,8.8-3.4 l-8.1-7.2c-0.2,0.1-0.5,0.3-0.7,0.4v-1l-6.3-5.6v20.2L15.4,42.6H2V20.5h10.2l-9.7-8.6l4.2-4.7L61.7,56L57.5,60.7L57.5,60.7z"/>
</svg>
`;
	var style_module_default = {
		canvas: "style-module__canvas",
		poster: "style-module__poster",
		playButton: "style-module__play-button",
		unmuteButton: "style-module__unmute-button",
		hidden: "style-module__hidden"
	};
	// src/lib/canvas2d.js
	var CanvasRenderer = class {
		constructor(options) {
			if (options.canvas) {
				this.canvas = options.canvas;
				this.ownsCanvasElement = false;
			} else {
				this.canvas = document.createElement("canvas");
				this.ownsCanvasElement = true;
			}
			this.width = this.canvas.width;
			this.height = this.canvas.height;
			this.enabled = true;
			this.context = this.canvas.getContext("2d");
		}
		destroy() {
			if (this.ownsCanvasElement) this.canvas.remove();
		}
		resize(width, height) {
			this.width = width | 0;
			this.height = height | 0;
			this.canvas.width = this.width;
			this.canvas.height = this.height;
			this.imageData = this.context.getImageData(0, 0, this.width, this.height);
			Fill(this.imageData.data, 255);
		}
		renderProgress(progress) {
			const w = this.canvas.width;
			const h = this.canvas.height;
			const ctx = this.context;
			ctx.fillStyle = "#222";
			ctx.fillRect(0, 0, w, h);
			ctx.fillStyle = "#fff";
			ctx.fillRect(0, h - h * progress, w, h * progress);
		}
		render(y, cb, cr) {
			this.YCbCrToRGBA(y, cb, cr, this.imageData.data);
			this.context.putImageData(this.imageData, 0, 0);
		}
		YCbCrToRGBA(y, cb, cr, rgba) {
			if (!this.enabled) return;
			const w = this.width + 15 >> 4 << 4;
			const w2 = w >> 1;
			let yIndex1 = 0;
			let yIndex2 = w;
			const yNext2Lines = w + (w - this.width);
			let cIndex = 0;
			const cNextLine = w2 - (this.width >> 1);
			let rgbaIndex1 = 0;
			let rgbaIndex2 = this.width * 4;
			const rgbaNext2Lines = this.width * 4;
			const cols = this.width >> 1;
			const rows = this.height >> 1;
			let ccb;
			let ccr;
			let r;
			let g;
			let b;
			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < cols; col++) {
					ccb = cb[cIndex];
					ccr = cr[cIndex];
					cIndex++;
					r = ccb + (ccb * 103 >> 8) - 179;
					g = (ccr * 88 >> 8) - 44 + (ccb * 183 >> 8) - 91;
					b = ccr + (ccr * 198 >> 8) - 227;
					const y1 = y[yIndex1++];
					const y2 = y[yIndex1++];
					rgba[rgbaIndex1] = y1 + r;
					rgba[rgbaIndex1 + 1] = y1 - g;
					rgba[rgbaIndex1 + 2] = y1 + b;
					rgba[rgbaIndex1 + 4] = y2 + r;
					rgba[rgbaIndex1 + 5] = y2 - g;
					rgba[rgbaIndex1 + 6] = y2 + b;
					rgbaIndex1 += 8;
					const y3 = y[yIndex2++];
					const y4 = y[yIndex2++];
					rgba[rgbaIndex2] = y3 + r;
					rgba[rgbaIndex2 + 1] = y3 - g;
					rgba[rgbaIndex2 + 2] = y3 + b;
					rgba[rgbaIndex2 + 4] = y4 + r;
					rgba[rgbaIndex2 + 5] = y4 - g;
					rgba[rgbaIndex2 + 6] = y4 + b;
					rgbaIndex2 += 8;
				}
				yIndex1 += yNext2Lines;
				yIndex2 += yNext2Lines;
				rgbaIndex1 += rgbaNext2Lines;
				rgbaIndex2 += rgbaNext2Lines;
				cIndex += cNextLine;
			}
		}
	};
	// src/lib/buffer.js
	var BitBuffer = class BitBuffer {
		constructor(bufferOrLength, mode) {
			if (typeof bufferOrLength === "object") {
				this.bytes = bufferOrLength instanceof Uint8Array ? bufferOrLength : new Uint8Array(bufferOrLength);
				this.byteLength = this.bytes.length;
			} else {
				this.bytes = new Uint8Array(bufferOrLength || 1048576);
				this.byteLength = 0;
			}
			this.mode = mode || BitBuffer.MODE.EXPAND;
			this.index = 0;
		}
		resize(size) {
			const newBytes = new Uint8Array(size);
			if (this.byteLength !== 0) {
				this.byteLength = Math.min(this.byteLength, size);
				newBytes.set(this.bytes, 0, this.byteLength);
			}
			this.bytes = newBytes;
			this.index = Math.min(this.index, this.byteLength << 3);
		}
		evict(sizeNeeded) {
			const bytePos = this.index >> 3;
			const available = this.bytes.length - this.byteLength;
			if (this.index === this.byteLength << 3 || sizeNeeded > available + bytePos) {
				this.byteLength = 0;
				this.index = 0;
				return;
			}
			if (bytePos === 0) return;
			if (this.bytes.copyWithin) this.bytes.copyWithin(0, bytePos, this.byteLength);
			else this.bytes.set(this.bytes.subarray(bytePos, this.byteLength));
			this.byteLength -= bytePos;
			this.index -= bytePos << 3;
		}
		write(buffers) {
			const isArrayOfBuffers = typeof buffers[0] === "object";
			let totalLength = 0;
			const available = this.bytes.length - this.byteLength;
			if (isArrayOfBuffers) {
				totalLength = 0;
				for (let i = 0; i < buffers.length; i++) totalLength += buffers[i].byteLength;
			} else totalLength = buffers.byteLength;
			if (totalLength > available) {
				if (this.mode === BitBuffer.MODE.EXPAND) {
					const newSize = Math.max(this.bytes.length * 2, totalLength - available);
					this.resize(newSize);
				} else this.evict(totalLength);
			}
			if (isArrayOfBuffers) for (let i = 0; i < buffers.length; i++) this.appendSingleBuffer(buffers[i]);
			else this.appendSingleBuffer(buffers);
			return totalLength;
		}
		appendSingleBuffer(buffer) {
			buffer = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
			this.bytes.set(buffer, this.byteLength);
			this.byteLength += buffer.length;
		}
		findNextStartCode() {
			for (let i = this.index + 7 >> 3; i < this.byteLength; i++) if (this.bytes[i] === 0 && this.bytes[i + 1] === 0 && this.bytes[i + 2] === 1) {
				this.index = i + 4 << 3;
				return this.bytes[i + 3];
			}
			this.index = this.byteLength << 3;
			return -1;
		}
		findStartCode(code) {
			const current = this.findNextStartCode();
			if (current === code || current === -1) return current;
			return -1;
		}
		nextBytesAreStartCode() {
			const i = this.index + 7 >> 3;
			return i >= this.byteLength || this.bytes[i] === 0 && this.bytes[i + 1] === 0 && this.bytes[i + 2] === 1;
		}
		peek(count) {
			let offset = this.index;
			let value = 0;
			while (count) {
				const currentByte = this.bytes[offset >> 3];
				const remaining = 8 - (offset & 7);
				const read = remaining < count ? remaining : count;
				const shift = remaining - read;
				const mask = 255 >> 8 - read;
				value = value << read | (currentByte & mask << shift) >> shift;
				offset += read;
				count -= read;
			}
			return value;
		}
		read(count) {
			const value = this.peek(count);
			this.index += count;
			return value;
		}
		skip(count) {
			return this.index += count;
		}
		rewind(count) {
			this.index = Math.max(this.index - count, 0);
		}
		has(count) {
			return (this.byteLength << 3) - this.index >= count;
		}
	};
	BitBuffer.MODE = {
		EVICT: 1,
		EXPAND: 2
	};
	// src/lib/decoder.js
	var BaseDecoder = class {
		constructor(options) {
			this.destination = null;
			this.canPlay = false;
			this.collectTimestamps = !options.streaming;
			this.bytesWritten = 0;
			this.timestamps = [];
			this.timestampIndex = 0;
			this.startTime = 0;
			this.decodedTime = 0;
			Object.defineProperty(this, "currentTime", { get: this.getCurrentTime });
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
				this.timestamps.push({
					index: this.bytesWritten << 3,
					time: pts
				});
			}
			this.bytesWritten += this.bufferWrite(buffers);
			this.canPlay = true;
		}
		seek(time) {
			if (!this.collectTimestamps) return;
			this.timestampIndex = 0;
			for (let i = 0; i < this.timestamps.length; i++) {
				if (this.timestamps[i].time > time) break;
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
					if (this.timestamps[i].index > currentIndex) break;
					newTimestampIndex = i;
				}
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
	};
	// src/lib/mp2.js
	var MP2 = class MP2 extends BaseDecoder {
		constructor(options) {
			super(options);
			this.onDecodeCallback = options.onAudioDecode;
			const bufferSize = options.audioBufferSize || 131072;
			const bufferMode = options.streaming ? BitBuffer.MODE.EVICT : BitBuffer.MODE.EXPAND;
			this.bits = new BitBuffer(bufferSize, bufferMode);
			this.left = /* @__PURE__ */ new Float32Array(1152);
			this.right = /* @__PURE__ */ new Float32Array(1152);
			this.sampleRate = 44100;
			this.D = /* @__PURE__ */ new Float32Array(1024);
			this.D.set(MP2.SYNTHESIS_WINDOW, 0);
			this.D.set(MP2.SYNTHESIS_WINDOW, 512);
			this.V = [/* @__PURE__ */ new Float32Array(1024), /* @__PURE__ */ new Float32Array(1024)];
			this.U = /* @__PURE__ */ new Int32Array(32);
			this.VPos = 0;
			this.allocation = [Array.from({ length: 32 }), Array.from({ length: 32 })];
			this.scaleFactorInfo = [/* @__PURE__ */ new Uint8Array(32), /* @__PURE__ */ new Uint8Array(32)];
			this.scaleFactor = [Array.from({ length: 32 }), Array.from({ length: 32 })];
			this.sample = [Array.from({ length: 32 }), Array.from({ length: 32 })];
			for (let j = 0; j < 2; j++) for (let i = 0; i < 32; i++) {
				this.scaleFactor[j][i] = [
					0,
					0,
					0
				];
				this.sample[j][i] = [
					0,
					0,
					0
				];
			}
		}
		decode() {
			const startTime = Now();
			const pos = this.bits.index >> 3;
			if (pos >= this.bits.byteLength) return false;
			const decoded = this.decodeFrame(this.left, this.right);
			this.bits.index = pos + decoded << 3;
			if (!decoded) return false;
			if (this.destination) this.destination.play(this.sampleRate, this.left, this.right);
			this.advanceDecodedTime(this.left.length / this.sampleRate);
			const elapsedTime = Now() - startTime;
			if (this.onDecodeCallback) this.onDecodeCallback(this, elapsedTime);
			return true;
		}
		getCurrentTime() {
			const enqueuedTime = this.destination ? this.destination.enqueuedTime : 0;
			return this.decodedTime - enqueuedTime;
		}
		decodeFrame(left, right) {
			const sync = this.bits.read(11);
			const version = this.bits.read(2);
			const layer = this.bits.read(2);
			const hasCRC = !this.bits.read(1);
			if (sync !== MP2.FRAME_SYNC || version !== MP2.VERSION.MPEG_1 || layer !== MP2.LAYER.II) return 0;
			let bitrateIndex = this.bits.read(4) - 1;
			if (bitrateIndex > 13) return 0;
			let sampleRateIndex = this.bits.read(2);
			let sampleRate = MP2.SAMPLE_RATE[sampleRateIndex];
			if (sampleRateIndex === 3) return 0;
			if (version === MP2.VERSION.MPEG_2) {
				sampleRateIndex += 4;
				bitrateIndex += 14;
			}
			const padding = this.bits.read(1);
			this.bits.read(1);
			const mode = this.bits.read(2);
			let bound = 0;
			if (mode === MP2.MODE.JOINT_STEREO) bound = this.bits.read(2) + 1 << 2;
			else {
				this.bits.skip(2);
				bound = mode === MP2.MODE.MONO ? 0 : 32;
			}
			this.bits.skip(4);
			if (hasCRC) this.bits.skip(16);
			const bitrate = MP2.BIT_RATE[bitrateIndex];
			sampleRate = MP2.SAMPLE_RATE[sampleRateIndex];
			const frameSize = 144e3 * bitrate / sampleRate + padding | 0;
			let tab3 = 0;
			let sblimit = 0;
			if (version === MP2.VERSION.MPEG_2) {
				tab3 = 2;
				sblimit = 30;
			} else {
				const tab1 = mode === MP2.MODE.MONO ? 0 : 1;
				const tab2 = MP2.QUANT_LUT_STEP_1[tab1][bitrateIndex];
				tab3 = MP2.QUANT_LUT_STEP_2[tab2][sampleRateIndex];
				sblimit = tab3 & 63;
				tab3 >>= 6;
			}
			if (bound > sblimit) bound = sblimit;
			for (let sb = 0; sb < bound; sb++) {
				this.allocation[0][sb] = this.readAllocation(sb, tab3);
				this.allocation[1][sb] = this.readAllocation(sb, tab3);
			}
			for (let sb = bound; sb < sblimit; sb++) this.allocation[0][sb] = this.allocation[1][sb] = this.readAllocation(sb, tab3);
			const channels = mode === MP2.MODE.MONO ? 1 : 2;
			for (let sb = 0; sb < sblimit; sb++) {
				for (let ch = 0; ch < channels; ch++) if (this.allocation[ch][sb]) this.scaleFactorInfo[ch][sb] = this.bits.read(2);
				if (mode === MP2.MODE.MONO) this.scaleFactorInfo[1][sb] = this.scaleFactorInfo[0][sb];
			}
			for (let sb = 0; sb < sblimit; sb++) {
				for (let ch = 0; ch < channels; ch++) if (this.allocation[ch][sb]) {
					const sf = this.scaleFactor[ch][sb];
					switch (this.scaleFactorInfo[ch][sb]) {
						case 0:
							sf[0] = this.bits.read(6);
							sf[1] = this.bits.read(6);
							sf[2] = this.bits.read(6);
							break;
						case 1:
							sf[0] = sf[1] = this.bits.read(6);
							sf[2] = this.bits.read(6);
							break;
						case 2:
							sf[0] = sf[1] = sf[2] = this.bits.read(6);
							break;
						case 3:
							sf[0] = this.bits.read(6);
							sf[1] = sf[2] = this.bits.read(6);
					}
				}
				if (mode === MP2.MODE.MONO) {
					this.scaleFactor[1][sb][0] = this.scaleFactor[0][sb][0];
					this.scaleFactor[1][sb][1] = this.scaleFactor[0][sb][1];
					this.scaleFactor[1][sb][2] = this.scaleFactor[0][sb][2];
				}
			}
			let outPos = 0;
			for (let part = 0; part < 3; part++) for (let granule = 0; granule < 4; granule++) {
				for (let sb = 0; sb < bound; sb++) {
					this.readSamples(0, sb, part);
					this.readSamples(1, sb, part);
				}
				for (let sb = bound; sb < sblimit; sb++) {
					this.readSamples(0, sb, part);
					this.sample[1][sb][0] = this.sample[0][sb][0];
					this.sample[1][sb][1] = this.sample[0][sb][1];
					this.sample[1][sb][2] = this.sample[0][sb][2];
				}
				for (let sb = sblimit; sb < 32; sb++) {
					this.sample[0][sb][0] = 0;
					this.sample[0][sb][1] = 0;
					this.sample[0][sb][2] = 0;
					this.sample[1][sb][0] = 0;
					this.sample[1][sb][1] = 0;
					this.sample[1][sb][2] = 0;
				}
				for (let p = 0; p < 3; p++) {
					this.VPos = this.VPos - 64 & 1023;
					for (let ch = 0; ch < 2; ch++) {
						MP2.MatrixTransform(this.sample[ch], p, this.V[ch], this.VPos);
						Fill(this.U, 0);
						let dIndex = 512 - (this.VPos >> 1);
						let vIndex = this.VPos % 128 >> 1;
						while (vIndex < 1024) {
							for (let i = 0; i < 32; ++i) this.U[i] += this.D[dIndex++] * this.V[ch][vIndex++];
							vIndex += 96;
							dIndex += 32;
						}
						vIndex = 1120 - vIndex;
						dIndex -= 480;
						while (vIndex < 1024) {
							for (let i = 0; i < 32; ++i) this.U[i] += this.D[dIndex++] * this.V[ch][vIndex++];
							vIndex += 96;
							dIndex += 32;
						}
						const outChannel = ch === 0 ? left : right;
						for (let j = 0; j < 32; j++) outChannel[outPos + j] = this.U[j] / 2147418112;
					}
					outPos += 32;
				}
			}
			this.sampleRate = sampleRate;
			return frameSize;
		}
		readAllocation(sb, tab3) {
			const tab4 = MP2.QUANT_LUT_STEP_3[tab3][sb];
			const qtab = MP2.QUANT_LUT_STEP4[tab4 & 15][this.bits.read(tab4 >> 4)];
			return qtab ? MP2.QUANT_TAB[qtab - 1] : 0;
		}
		readSamples(ch, sb, part) {
			const q = this.allocation[ch][sb];
			let sf = this.scaleFactor[ch][sb][part];
			const sample = this.sample[ch][sb];
			let val = 0;
			if (!q) {
				sample[0] = sample[1] = sample[2] = 0;
				return;
			}
			if (sf === 63) sf = 0;
			else {
				const shift = sf / 3 | 0;
				sf = MP2.SCALEFACTOR_BASE[sf % 3] + (1 << shift >> 1) >> shift;
			}
			let adj = q.levels;
			if (q.group) {
				val = this.bits.read(q.bits);
				sample[0] = val % adj;
				val = val / adj | 0;
				sample[1] = val % adj;
				sample[2] = val / adj | 0;
			} else {
				sample[0] = this.bits.read(q.bits);
				sample[1] = this.bits.read(q.bits);
				sample[2] = this.bits.read(q.bits);
			}
			const scale = 65536 / (adj + 1) | 0;
			adj = (adj + 1 >> 1) - 1;
			val = (adj - sample[0]) * scale;
			sample[0] = val * (sf >> 12) + (val * (sf & 4095) + 2048 >> 12) >> 12;
			val = (adj - sample[1]) * scale;
			sample[1] = val * (sf >> 12) + (val * (sf & 4095) + 2048 >> 12) >> 12;
			val = (adj - sample[2]) * scale;
			sample[2] = val * (sf >> 12) + (val * (sf & 4095) + 2048 >> 12) >> 12;
		}
		static MatrixTransform(s, ss, d, dp) {
			let t01;
			let t02;
			let t03;
			let t04;
			let t05;
			let t06;
			let t07;
			let t08;
			let t09;
			let t10;
			let t11;
			let t12;
			let t13;
			let t14;
			let t15;
			let t16;
			let t17;
			let t18;
			let t19;
			let t20;
			let t21;
			let t22;
			let t23;
			let t24;
			let t25;
			let t26;
			let t27;
			let t28;
			let t29;
			let t30;
			let t31;
			let t32;
			let t33;
			t01 = s[0][ss] + s[31][ss];
			t02 = (s[0][ss] - s[31][ss]) * .500602998235;
			t03 = s[1][ss] + s[30][ss];
			t04 = (s[1][ss] - s[30][ss]) * .505470959898;
			t05 = s[2][ss] + s[29][ss];
			t06 = (s[2][ss] - s[29][ss]) * .515447309923;
			t07 = s[3][ss] + s[28][ss];
			t08 = (s[3][ss] - s[28][ss]) * .53104259109;
			t09 = s[4][ss] + s[27][ss];
			t10 = (s[4][ss] - s[27][ss]) * .553103896034;
			t11 = s[5][ss] + s[26][ss];
			t12 = (s[5][ss] - s[26][ss]) * .582934968206;
			t13 = s[6][ss] + s[25][ss];
			t14 = (s[6][ss] - s[25][ss]) * .622504123036;
			t15 = s[7][ss] + s[24][ss];
			t16 = (s[7][ss] - s[24][ss]) * .674808341455;
			t17 = s[8][ss] + s[23][ss];
			t18 = (s[8][ss] - s[23][ss]) * .744536271002;
			t19 = s[9][ss] + s[22][ss];
			t20 = (s[9][ss] - s[22][ss]) * .839349645416;
			t21 = s[10][ss] + s[21][ss];
			t22 = (s[10][ss] - s[21][ss]) * .972568237862;
			t23 = s[11][ss] + s[20][ss];
			t24 = (s[11][ss] - s[20][ss]) * 1.16943993343;
			t25 = s[12][ss] + s[19][ss];
			t26 = (s[12][ss] - s[19][ss]) * 1.48416461631;
			t27 = s[13][ss] + s[18][ss];
			t28 = (s[13][ss] - s[18][ss]) * 2.05778100995;
			t29 = s[14][ss] + s[17][ss];
			t30 = (s[14][ss] - s[17][ss]) * 3.40760841847;
			t31 = s[15][ss] + s[16][ss];
			t32 = (s[15][ss] - s[16][ss]) * 10.1900081235;
			t33 = t01 + t31;
			t31 = (t01 - t31) * .502419286188;
			t01 = t03 + t29;
			t29 = (t03 - t29) * .52249861494;
			t03 = t05 + t27;
			t27 = (t05 - t27) * .566944034816;
			t05 = t07 + t25;
			t25 = (t07 - t25) * .64682178336;
			t07 = t09 + t23;
			t23 = (t09 - t23) * .788154623451;
			t09 = t11 + t21;
			t21 = (t11 - t21) * 1.06067768599;
			t11 = t13 + t19;
			t19 = (t13 - t19) * 1.72244709824;
			t13 = t15 + t17;
			t17 = (t15 - t17) * 5.10114861869;
			t15 = t33 + t13;
			t13 = (t33 - t13) * .509795579104;
			t33 = t01 + t11;
			t01 = (t01 - t11) * .601344886935;
			t11 = t03 + t09;
			t09 = (t03 - t09) * .899976223136;
			t03 = t05 + t07;
			t07 = (t05 - t07) * 2.56291544774;
			t05 = t15 + t03;
			t15 = (t15 - t03) * .541196100146;
			t03 = t33 + t11;
			t11 = (t33 - t11) * 1.30656296488;
			t33 = t05 + t03;
			t05 = (t05 - t03) * .707106781187;
			t03 = t15 + t11;
			t15 = (t15 - t11) * .707106781187;
			t03 += t15;
			t11 = t13 + t07;
			t13 = (t13 - t07) * .541196100146;
			t07 = t01 + t09;
			t09 = (t01 - t09) * 1.30656296488;
			t01 = t11 + t07;
			t07 = (t11 - t07) * .707106781187;
			t11 = t13 + t09;
			t13 = (t13 - t09) * .707106781187;
			t11 += t13;
			t01 += t11;
			t11 += t07;
			t07 += t13;
			t09 = t31 + t17;
			t31 = (t31 - t17) * .509795579104;
			t17 = t29 + t19;
			t29 = (t29 - t19) * .601344886935;
			t19 = t27 + t21;
			t21 = (t27 - t21) * .899976223136;
			t27 = t25 + t23;
			t23 = (t25 - t23) * 2.56291544774;
			t25 = t09 + t27;
			t09 = (t09 - t27) * .541196100146;
			t27 = t17 + t19;
			t19 = (t17 - t19) * 1.30656296488;
			t17 = t25 + t27;
			t27 = (t25 - t27) * .707106781187;
			t25 = t09 + t19;
			t19 = (t09 - t19) * .707106781187;
			t25 += t19;
			t09 = t31 + t23;
			t31 = (t31 - t23) * .541196100146;
			t23 = t29 + t21;
			t21 = (t29 - t21) * 1.30656296488;
			t29 = t09 + t23;
			t23 = (t09 - t23) * .707106781187;
			t09 = t31 + t21;
			t31 = (t31 - t21) * .707106781187;
			t09 += t31;
			t29 += t09;
			t09 += t23;
			t23 += t31;
			t17 += t29;
			t29 += t25;
			t25 += t09;
			t09 += t27;
			t27 += t23;
			t23 += t19;
			t19 += t31;
			t21 = t02 + t32;
			t02 = (t02 - t32) * .502419286188;
			t32 = t04 + t30;
			t04 = (t04 - t30) * .52249861494;
			t30 = t06 + t28;
			t28 = (t06 - t28) * .566944034816;
			t06 = t08 + t26;
			t08 = (t08 - t26) * .64682178336;
			t26 = t10 + t24;
			t10 = (t10 - t24) * .788154623451;
			t24 = t12 + t22;
			t22 = (t12 - t22) * 1.06067768599;
			t12 = t14 + t20;
			t20 = (t14 - t20) * 1.72244709824;
			t14 = t16 + t18;
			t16 = (t16 - t18) * 5.10114861869;
			t18 = t21 + t14;
			t14 = (t21 - t14) * .509795579104;
			t21 = t32 + t12;
			t32 = (t32 - t12) * .601344886935;
			t12 = t30 + t24;
			t24 = (t30 - t24) * .899976223136;
			t30 = t06 + t26;
			t26 = (t06 - t26) * 2.56291544774;
			t06 = t18 + t30;
			t18 = (t18 - t30) * .541196100146;
			t30 = t21 + t12;
			t12 = (t21 - t12) * 1.30656296488;
			t21 = t06 + t30;
			t30 = (t06 - t30) * .707106781187;
			t06 = t18 + t12;
			t12 = (t18 - t12) * .707106781187;
			t06 += t12;
			t18 = t14 + t26;
			t26 = (t14 - t26) * .541196100146;
			t14 = t32 + t24;
			t24 = (t32 - t24) * 1.30656296488;
			t32 = t18 + t14;
			t14 = (t18 - t14) * .707106781187;
			t18 = t26 + t24;
			t24 = (t26 - t24) * .707106781187;
			t18 += t24;
			t32 += t18;
			t18 += t14;
			t26 = t14 + t24;
			t14 = t02 + t16;
			t02 = (t02 - t16) * .509795579104;
			t16 = t04 + t20;
			t04 = (t04 - t20) * .601344886935;
			t20 = t28 + t22;
			t22 = (t28 - t22) * .899976223136;
			t28 = t08 + t10;
			t10 = (t08 - t10) * 2.56291544774;
			t08 = t14 + t28;
			t14 = (t14 - t28) * .541196100146;
			t28 = t16 + t20;
			t20 = (t16 - t20) * 1.30656296488;
			t16 = t08 + t28;
			t28 = (t08 - t28) * .707106781187;
			t08 = t14 + t20;
			t20 = (t14 - t20) * .707106781187;
			t08 += t20;
			t14 = t02 + t10;
			t02 = (t02 - t10) * .541196100146;
			t10 = t04 + t22;
			t22 = (t04 - t22) * 1.30656296488;
			t04 = t14 + t10;
			t10 = (t14 - t10) * .707106781187;
			t14 = t02 + t22;
			t02 = (t02 - t22) * .707106781187;
			t14 += t02;
			t04 += t14;
			t14 += t10;
			t10 += t02;
			t16 += t04;
			t04 += t08;
			t08 += t14;
			t14 += t28;
			t28 += t10;
			t10 += t20;
			t20 += t02;
			t21 += t16;
			t16 += t32;
			t32 += t04;
			t04 += t06;
			t06 += t08;
			t08 += t18;
			t18 += t14;
			t14 += t30;
			t30 += t28;
			t28 += t26;
			t26 += t10;
			t10 += t12;
			t12 += t20;
			t20 += t24;
			t24 += t02;
			d[dp + 48] = -t33;
			d[dp + 49] = d[dp + 47] = -t21;
			d[dp + 50] = d[dp + 46] = -t17;
			d[dp + 51] = d[dp + 45] = -t16;
			d[dp + 52] = d[dp + 44] = -t01;
			d[dp + 53] = d[dp + 43] = -t32;
			d[dp + 54] = d[dp + 42] = -t29;
			d[dp + 55] = d[dp + 41] = -t04;
			d[dp + 56] = d[dp + 40] = -t03;
			d[dp + 57] = d[dp + 39] = -t06;
			d[dp + 58] = d[dp + 38] = -t25;
			d[dp + 59] = d[dp + 37] = -t08;
			d[dp + 60] = d[dp + 36] = -t11;
			d[dp + 61] = d[dp + 35] = -t18;
			d[dp + 62] = d[dp + 34] = -t09;
			d[dp + 63] = d[dp + 33] = -t14;
			d[dp + 32] = -t05;
			d[dp + 0] = t05;
			d[dp + 31] = -t30;
			d[dp + 1] = t30;
			d[dp + 30] = -t27;
			d[dp + 2] = t27;
			d[dp + 29] = -t28;
			d[dp + 3] = t28;
			d[dp + 28] = -t07;
			d[dp + 4] = t07;
			d[dp + 27] = -t26;
			d[dp + 5] = t26;
			d[dp + 26] = -t23;
			d[dp + 6] = t23;
			d[dp + 25] = -t10;
			d[dp + 7] = t10;
			d[dp + 24] = -t15;
			d[dp + 8] = t15;
			d[dp + 23] = -t12;
			d[dp + 9] = t12;
			d[dp + 22] = -t19;
			d[dp + 10] = t19;
			d[dp + 21] = -t20;
			d[dp + 11] = t20;
			d[dp + 20] = -t13;
			d[dp + 12] = t13;
			d[dp + 19] = -t24;
			d[dp + 13] = t24;
			d[dp + 18] = -t31;
			d[dp + 14] = t31;
			d[dp + 17] = -t02;
			d[dp + 15] = t02;
			d[dp + 16] = 0;
		}
	};
	MP2.FRAME_SYNC = 2047;
	MP2.VERSION = {
		MPEG_2_5: 0,
		MPEG_2: 2,
		MPEG_1: 3
	};
	MP2.LAYER = {
		III: 1,
		II: 2,
		I: 3
	};
	MP2.MODE = {
		STEREO: 0,
		JOINT_STEREO: 1,
		DUAL_CHANNEL: 2,
		MONO: 3
	};
	MP2.SAMPLE_RATE = new Uint16Array([
		44100,
		48e3,
		32e3,
		0,
		22050,
		24e3,
		16e3,
		0
	]);
	MP2.BIT_RATE = new Uint16Array([
		32,
		48,
		56,
		64,
		80,
		96,
		112,
		128,
		160,
		192,
		224,
		256,
		320,
		384,
		8,
		16,
		24,
		32,
		40,
		48,
		56,
		64,
		80,
		96,
		112,
		128,
		144,
		160
	]);
	MP2.SCALEFACTOR_BASE = new Uint32Array([
		33554432,
		26632170,
		21137968
	]);
	MP2.SYNTHESIS_WINDOW = new Float32Array([
		0,
		-.5,
		-.5,
		-.5,
		-.5,
		-.5,
		-.5,
		-1,
		-1,
		-1,
		-1,
		-1.5,
		-1.5,
		-2,
		-2,
		-2.5,
		-2.5,
		-3,
		-3.5,
		-3.5,
		-4,
		-4.5,
		-5,
		-5.5,
		-6.5,
		-7,
		-8,
		-8.5,
		-9.5,
		-10.5,
		-12,
		-13,
		-14.5,
		-15.5,
		-17.5,
		-19,
		-20.5,
		-22.5,
		-24.5,
		-26.5,
		-29,
		-31.5,
		-34,
		-36.5,
		-39.5,
		-42.5,
		-45.5,
		-48.5,
		-52,
		-55.5,
		-58.5,
		-62.5,
		-66,
		-69.5,
		-73.5,
		-77,
		-80.5,
		-84.5,
		-88,
		-91.5,
		-95,
		-98,
		-101,
		-104,
		106.5,
		109,
		111,
		112.5,
		113.5,
		114,
		114,
		113.5,
		112,
		110.5,
		107.5,
		104,
		100,
		94.5,
		88.5,
		81.5,
		73,
		63.5,
		53,
		41.5,
		28.5,
		14.5,
		-1,
		-18,
		-36,
		-55.5,
		-76.5,
		-98.5,
		-122,
		-147,
		-173.5,
		-200.5,
		-229.5,
		-259.5,
		-290.5,
		-322.5,
		-355.5,
		-389.5,
		-424,
		-459.5,
		-495.5,
		-532,
		-568.5,
		-605,
		-641.5,
		-678,
		-714,
		-749,
		-783.5,
		-817,
		-849,
		-879.5,
		-908.5,
		-935,
		-959.5,
		-981,
		-1000.5,
		-1016,
		-1028.5,
		-1037.5,
		-1042.5,
		-1043.5,
		-1040,
		-1031.5,
		1018.5,
		1e3,
		976,
		946.5,
		911,
		869.5,
		822,
		767.5,
		707,
		640,
		565.5,
		485,
		397,
		302.5,
		201,
		92.5,
		-22.5,
		-144,
		-272.5,
		-407,
		-547.5,
		-694,
		-846,
		-1003,
		-1165,
		-1331.5,
		-1502,
		-1675.5,
		-1852.5,
		-2031.5,
		-2212.5,
		-2394,
		-2576.5,
		-2758.5,
		-2939.5,
		-3118.5,
		-3294.5,
		-3467.5,
		-3635.5,
		-3798.5,
		-3955,
		-4104.5,
		-4245.5,
		-4377.5,
		-4499,
		-4609.5,
		-4708,
		-4792.5,
		-4863.5,
		-4919,
		-4958,
		-4979.5,
		-4983,
		-4967.5,
		-4931.5,
		-4875,
		-4796,
		-4694.5,
		-4569.5,
		-4420,
		-4246,
		-4046,
		-3820,
		-3567,
		3287,
		2979.5,
		2644,
		2280.5,
		1888,
		1467.5,
		1018.5,
		541,
		35,
		-499,
		-1061,
		-1650,
		-2266.5,
		-2909,
		-3577,
		-4270,
		-4987.5,
		-5727.5,
		-6490,
		-7274,
		-8077.5,
		-8899.5,
		-9739,
		-10594.5,
		-11464.5,
		-12347,
		-13241,
		-14144.5,
		-15056,
		-15973.5,
		-16895.5,
		-17820,
		-18744.5,
		-19668,
		-20588,
		-21503,
		-22410.5,
		-23308.5,
		-24195,
		-25068.5,
		-25926.5,
		-26767,
		-27589,
		-28389,
		-29166.5,
		-29919,
		-30644.5,
		-31342,
		-32009.5,
		-32645,
		-33247,
		-33814.5,
		-34346,
		-34839.5,
		-35295,
		-35710,
		-36084.5,
		-36417.5,
		-36707.5,
		-36954,
		-37156.5,
		-37315,
		-37428,
		-37496,
		37519,
		37496,
		37428,
		37315,
		37156.5,
		36954,
		36707.5,
		36417.5,
		36084.5,
		35710,
		35295,
		34839.5,
		34346,
		33814.5,
		33247,
		32645,
		32009.5,
		31342,
		30644.5,
		29919,
		29166.5,
		28389,
		27589,
		26767,
		25926.5,
		25068.5,
		24195,
		23308.5,
		22410.5,
		21503,
		20588,
		19668,
		18744.5,
		17820,
		16895.5,
		15973.5,
		15056,
		14144.5,
		13241,
		12347,
		11464.5,
		10594.5,
		9739,
		8899.5,
		8077.5,
		7274,
		6490,
		5727.5,
		4987.5,
		4270,
		3577,
		2909,
		2266.5,
		1650,
		1061,
		499,
		-35,
		-541,
		-1018.5,
		-1467.5,
		-1888,
		-2280.5,
		-2644,
		-2979.5,
		3287,
		3567,
		3820,
		4046,
		4246,
		4420,
		4569.5,
		4694.5,
		4796,
		4875,
		4931.5,
		4967.5,
		4983,
		4979.5,
		4958,
		4919,
		4863.5,
		4792.5,
		4708,
		4609.5,
		4499,
		4377.5,
		4245.5,
		4104.5,
		3955,
		3798.5,
		3635.5,
		3467.5,
		3294.5,
		3118.5,
		2939.5,
		2758.5,
		2576.5,
		2394,
		2212.5,
		2031.5,
		1852.5,
		1675.5,
		1502,
		1331.5,
		1165,
		1003,
		846,
		694,
		547.5,
		407,
		272.5,
		144,
		22.5,
		-92.5,
		-201,
		-302.5,
		-397,
		-485,
		-565.5,
		-640,
		-707,
		-767.5,
		-822,
		-869.5,
		-911,
		-946.5,
		-976,
		-1e3,
		1018.5,
		1031.5,
		1040,
		1043.5,
		1042.5,
		1037.5,
		1028.5,
		1016,
		1000.5,
		981,
		959.5,
		935,
		908.5,
		879.5,
		849,
		817,
		783.5,
		749,
		714,
		678,
		641.5,
		605,
		568.5,
		532,
		495.5,
		459.5,
		424,
		389.5,
		355.5,
		322.5,
		290.5,
		259.5,
		229.5,
		200.5,
		173.5,
		147,
		122,
		98.5,
		76.5,
		55.5,
		36,
		18,
		1,
		-14.5,
		-28.5,
		-41.5,
		-53,
		-63.5,
		-73,
		-81.5,
		-88.5,
		-94.5,
		-100,
		-104,
		-107.5,
		-110.5,
		-112,
		-113.5,
		-114,
		-114,
		-113.5,
		-112.5,
		-111,
		-109,
		106.5,
		104,
		101,
		98,
		95,
		91.5,
		88,
		84.5,
		80.5,
		77,
		73.5,
		69.5,
		66,
		62.5,
		58.5,
		55.5,
		52,
		48.5,
		45.5,
		42.5,
		39.5,
		36.5,
		34,
		31.5,
		29,
		26.5,
		24.5,
		22.5,
		20.5,
		19,
		17.5,
		15.5,
		14.5,
		13,
		12,
		10.5,
		9.5,
		8.5,
		8,
		7,
		6.5,
		5.5,
		5,
		4.5,
		4,
		3.5,
		3.5,
		3,
		2.5,
		2.5,
		2,
		2,
		1.5,
		1.5,
		1,
		1,
		1,
		1,
		.5,
		.5,
		.5,
		.5,
		.5,
		.5
	]);
	MP2.QUANT_LUT_STEP_1 = [[
		0,
		0,
		1,
		1,
		1,
		2,
		2,
		2,
		2,
		2,
		2,
		2,
		2,
		2
	], [
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		1,
		1,
		2,
		2,
		2,
		2,
		2
	]];
	MP2.QUANT_TAB = {
		A: 91,
		B: 94,
		C: 8,
		D: 12
	};
	MP2.QUANT_LUT_STEP_2 = [
		[
			MP2.QUANT_TAB.C,
			MP2.QUANT_TAB.C,
			MP2.QUANT_TAB.D
		],
		[
			MP2.QUANT_TAB.A,
			MP2.QUANT_TAB.A,
			MP2.QUANT_TAB.A
		],
		[
			MP2.QUANT_TAB.B,
			MP2.QUANT_TAB.A,
			MP2.QUANT_TAB.B
		]
	];
	MP2.QUANT_LUT_STEP_3 = [
		[
			68,
			68,
			52,
			52,
			52,
			52,
			52,
			52,
			52,
			52,
			52,
			52
		],
		[
			67,
			67,
			67,
			66,
			66,
			66,
			66,
			66,
			66,
			66,
			66,
			49,
			49,
			49,
			49,
			49,
			49,
			49,
			49,
			49,
			49,
			49,
			49,
			32,
			32,
			32,
			32,
			32,
			32,
			32
		],
		[
			69,
			69,
			69,
			69,
			52,
			52,
			52,
			52,
			52,
			52,
			52,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36
		]
	];
	MP2.QUANT_LUT_STEP4 = [
		[
			0,
			1,
			2,
			17
		],
		[
			0,
			1,
			2,
			3,
			4,
			5,
			6,
			17
		],
		[
			0,
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12,
			13,
			14,
			17
		],
		[
			0,
			1,
			3,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12,
			13,
			14,
			15,
			16,
			17
		],
		[
			0,
			1,
			2,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12,
			13,
			14,
			15,
			17
		],
		[
			0,
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12,
			13,
			14,
			15
		]
	];
	MP2.QUANT_TAB = [
		{
			levels: 3,
			group: 1,
			bits: 5
		},
		{
			levels: 5,
			group: 1,
			bits: 7
		},
		{
			levels: 7,
			group: 0,
			bits: 3
		},
		{
			levels: 9,
			group: 1,
			bits: 10
		},
		{
			levels: 15,
			group: 0,
			bits: 4
		},
		{
			levels: 31,
			group: 0,
			bits: 5
		},
		{
			levels: 63,
			group: 0,
			bits: 6
		},
		{
			levels: 127,
			group: 0,
			bits: 7
		},
		{
			levels: 255,
			group: 0,
			bits: 8
		},
		{
			levels: 511,
			group: 0,
			bits: 9
		},
		{
			levels: 1023,
			group: 0,
			bits: 10
		},
		{
			levels: 2047,
			group: 0,
			bits: 11
		},
		{
			levels: 4095,
			group: 0,
			bits: 12
		},
		{
			levels: 8191,
			group: 0,
			bits: 13
		},
		{
			levels: 16383,
			group: 0,
			bits: 14
		},
		{
			levels: 32767,
			group: 0,
			bits: 15
		},
		{
			levels: 65535,
			group: 0,
			bits: 16
		}
	];
	// src/lib/mp2-wasm.js
	var MP2WASM = class MP2WASM extends BaseDecoder {
		constructor(options) {
			super(options);
			this.onDecodeCallback = options.onAudioDecode;
			this.module = options.wasmModule;
			this.bufferSize = options.audioBufferSize || 131072;
			this.bufferMode = options.streaming ? BitBuffer.MODE.EVICT : BitBuffer.MODE.EXPAND;
			this.sampleRate = 0;
			this.destroyed = false;
		}
		initializeWasmDecoder() {
			if (this.destroyed) return;
			if (!this.module.instance) {
				console.warn("JSMpeg: WASM module not compiled yet");
				return;
			}
			this.instance = this.module.instance;
			this.functions = this.module.instance.exports;
			this.decoder = this.functions._mp2_decoder_create(this.bufferSize, this.bufferMode);
		}
		destroy() {
			this.destroyed = true;
			if (!this.decoder) return;
			this.functions._mp2_decoder_destroy(this.decoder);
			this.decoder = null;
			this.canPlay = false;
		}
		write(pts, buffers) {
			if (this.destroyed) return;
			super.write(pts, buffers);
		}
		bufferGetIndex() {
			if (!this.decoder) return;
			return this.functions._mp2_decoder_get_index(this.decoder);
		}
		bufferSetIndex(index) {
			if (!this.decoder) return;
			this.functions._mp2_decoder_set_index(this.decoder, index);
		}
		bufferWrite(buffers) {
			if (this.destroyed) return 0;
			if (!this.decoder) this.initializeWasmDecoder();
			if (!this.decoder) return 0;
			let totalLength = 0;
			for (let i = 0; i < buffers.length; i++) totalLength += buffers[i].length;
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
			if (!this.decoder) return false;
			if (this.functions._mp2_decoder_decode(this.decoder) === 0) return false;
			if (!this.sampleRate) this.sampleRate = this.functions._mp2_decoder_get_sample_rate(this.decoder);
			if (this.destination) {
				const leftPtr = this.functions._mp2_decoder_get_left_channel_ptr(this.decoder);
				const rightPtr = this.functions._mp2_decoder_get_right_channel_ptr(this.decoder);
				const leftOffset = leftPtr / Float32Array.BYTES_PER_ELEMENT;
				const rightOffset = rightPtr / Float32Array.BYTES_PER_ELEMENT;
				const left = this.instance.heapF32.subarray(leftOffset, leftOffset + MP2WASM.SAMPLES_PER_FRAME);
				const right = this.instance.heapF32.subarray(rightOffset, rightOffset + MP2WASM.SAMPLES_PER_FRAME);
				this.destination.play(this.sampleRate, left, right);
			}
			this.advanceDecodedTime(MP2WASM.SAMPLES_PER_FRAME / this.sampleRate);
			const elapsedTime = Now() - startTime;
			if (this.onDecodeCallback) this.onDecodeCallback(this, elapsedTime);
			return true;
		}
		getCurrentTime() {
			const enqueuedTime = this.destination ? this.destination.enqueuedTime : 0;
			return this.decodedTime - enqueuedTime;
		}
	};
	MP2WASM.SAMPLES_PER_FRAME = 1152;
	// src/lib/mpeg1.js
	var MPEG1 = class MPEG1 extends BaseDecoder {
		constructor(options) {
			super(options);
			this.onDecodeCallback = options.onVideoDecode;
			const bufferSize = options.videoBufferSize || 524288;
			const bufferMode = options.streaming ? BitBuffer.MODE.EVICT : BitBuffer.MODE.EXPAND;
			this.bits = new BitBuffer(bufferSize, bufferMode);
			this.customIntraQuantMatrix = /* @__PURE__ */ new Uint8Array(64);
			this.customNonIntraQuantMatrix = /* @__PURE__ */ new Uint8Array(64);
			this.blockData = /* @__PURE__ */ new Int32Array(64);
			this.currentFrame = 0;
			this.decodeFirstFrame = options.decodeFirstFrame !== false;
		}
		write(pts, buffers) {
			BaseDecoder.prototype.write.call(this, pts, buffers);
			if (!this.hasSequenceHeader) {
				if (this.bits.findStartCode(MPEG1.START.SEQUENCE) === -1) return false;
				this.decodeSequenceHeader();
				if (this.decodeFirstFrame) this.decode();
			}
		}
		decode() {
			const startTime = Now();
			if (!this.hasSequenceHeader) return false;
			if (this.bits.findStartCode(MPEG1.START.PICTURE) === -1) return false;
			this.decodePicture();
			this.advanceDecodedTime(1 / this.frameRate);
			const elapsedTime = Now() - startTime;
			if (this.onDecodeCallback) this.onDecodeCallback(this, elapsedTime);
			return true;
		}
		readHuffman(codeTable) {
			let state = 0;
			do
				state = codeTable[state + this.bits.read(1)];
			while (state >= 0 && codeTable[state] !== 0);
			return codeTable[state + 2];
		}
		decodeSequenceHeader() {
			const newWidth = this.bits.read(12);
			const newHeight = this.bits.read(12);
			this.bits.skip(4);
			this.frameRate = MPEG1.PICTURE_RATE[this.bits.read(4)];
			this.bits.skip(30);
			if (newWidth !== this.width || newHeight !== this.height) {
				this.width = newWidth;
				this.height = newHeight;
				this.initBuffers();
				if (this.destination) this.destination.resize(newWidth, newHeight);
			}
			if (this.bits.read(1)) {
				for (let i = 0; i < 64; i++) this.customIntraQuantMatrix[MPEG1.ZIG_ZAG[i]] = this.bits.read(8);
				this.intraQuantMatrix = this.customIntraQuantMatrix;
			}
			if (this.bits.read(1)) {
				for (let i = 0; i < 64; i++) {
					const idx = MPEG1.ZIG_ZAG[i];
					this.customNonIntraQuantMatrix[idx] = this.bits.read(8);
				}
				this.nonIntraQuantMatrix = this.customNonIntraQuantMatrix;
			}
			this.hasSequenceHeader = true;
		}
		initBuffers() {
			this.intraQuantMatrix = MPEG1.DEFAULT_INTRA_QUANT_MATRIX;
			this.nonIntraQuantMatrix = MPEG1.DEFAULT_NON_INTRA_QUANT_MATRIX;
			this.mbWidth = this.width + 15 >> 4;
			this.mbHeight = this.height + 15 >> 4;
			this.mbSize = this.mbWidth * this.mbHeight;
			this.codedWidth = this.mbWidth << 4;
			this.codedHeight = this.mbHeight << 4;
			this.codedSize = this.codedWidth * this.codedHeight;
			this.halfWidth = this.mbWidth << 3;
			this.halfHeight = this.mbHeight << 3;
			this.currentY = new Uint8ClampedArray(this.codedSize);
			this.currentY32 = new Uint32Array(this.currentY.buffer);
			this.currentCr = new Uint8ClampedArray(this.codedSize >> 2);
			this.currentCr32 = new Uint32Array(this.currentCr.buffer);
			this.currentCb = new Uint8ClampedArray(this.codedSize >> 2);
			this.currentCb32 = new Uint32Array(this.currentCb.buffer);
			this.forwardY = new Uint8ClampedArray(this.codedSize);
			this.forwardY32 = new Uint32Array(this.forwardY.buffer);
			this.forwardCr = new Uint8ClampedArray(this.codedSize >> 2);
			this.forwardCr32 = new Uint32Array(this.forwardCr.buffer);
			this.forwardCb = new Uint8ClampedArray(this.codedSize >> 2);
			this.forwardCb32 = new Uint32Array(this.forwardCb.buffer);
		}
		decodePicture() {
			this.currentFrame++;
			this.bits.skip(10);
			this.pictureType = this.bits.read(3);
			this.bits.skip(16);
			if (this.pictureType <= 0 || this.pictureType >= MPEG1.PICTURE_TYPE.B) return;
			if (this.pictureType === MPEG1.PICTURE_TYPE.PREDICTIVE) {
				this.fullPelForward = this.bits.read(1);
				this.forwardFCode = this.bits.read(3);
				if (this.forwardFCode === 0) return;
				this.forwardRSize = this.forwardFCode - 1;
				this.forwardF = 1 << this.forwardRSize;
			}
			let code = 0;
			do
				code = this.bits.findNextStartCode();
			while (code === MPEG1.START.EXTENSION || code === MPEG1.START.USER_DATA);
			while (code >= MPEG1.START.SLICE_FIRST && code <= MPEG1.START.SLICE_LAST) {
				this.decodeSlice(code & 255);
				code = this.bits.findNextStartCode();
			}
			if (code !== -1) this.bits.rewind(32);
			if (this.destination) this.destination.render(this.currentY, this.currentCr, this.currentCb, true);
			if (this.pictureType === MPEG1.PICTURE_TYPE.INTRA || this.pictureType === MPEG1.PICTURE_TYPE.PREDICTIVE) {
				const tmpY = this.forwardY;
				const tmpY32 = this.forwardY32;
				const tmpCr = this.forwardCr;
				const tmpCr32 = this.forwardCr32;
				const tmpCb = this.forwardCb;
				const tmpCb32 = this.forwardCb32;
				this.forwardY = this.currentY;
				this.forwardY32 = this.currentY32;
				this.forwardCr = this.currentCr;
				this.forwardCr32 = this.currentCr32;
				this.forwardCb = this.currentCb;
				this.forwardCb32 = this.currentCb32;
				this.currentY = tmpY;
				this.currentY32 = tmpY32;
				this.currentCr = tmpCr;
				this.currentCr32 = tmpCr32;
				this.currentCb = tmpCb;
				this.currentCb32 = tmpCb32;
			}
		}
		decodeSlice(slice) {
			this.sliceBegin = true;
			this.macroblockAddress = (slice - 1) * this.mbWidth - 1;
			this.motionFwH = this.motionFwHPrev = 0;
			this.motionFwV = this.motionFwVPrev = 0;
			this.dcPredictorY = 128;
			this.dcPredictorCr = 128;
			this.dcPredictorCb = 128;
			this.quantizerScale = this.bits.read(5);
			while (this.bits.read(1)) this.bits.skip(8);
			do
				this.decodeMacroblock();
			while (!this.bits.nextBytesAreStartCode());
		}
		decodeMacroblock() {
			let increment = 0;
			let t = this.readHuffman(MPEG1.MACROBLOCK_ADDRESS_INCREMENT);
			while (t === 34) t = this.readHuffman(MPEG1.MACROBLOCK_ADDRESS_INCREMENT);
			while (t === 35) {
				increment += 33;
				t = this.readHuffman(MPEG1.MACROBLOCK_ADDRESS_INCREMENT);
			}
			increment += t;
			if (this.sliceBegin) {
				this.sliceBegin = false;
				this.macroblockAddress += increment;
			} else {
				if (this.macroblockAddress + increment >= this.mbSize) return;
				if (increment > 1) {
					this.dcPredictorY = 128;
					this.dcPredictorCr = 128;
					this.dcPredictorCb = 128;
					if (this.pictureType === MPEG1.PICTURE_TYPE.PREDICTIVE) {
						this.motionFwH = this.motionFwHPrev = 0;
						this.motionFwV = this.motionFwVPrev = 0;
					}
				}
				while (increment > 1) {
					this.macroblockAddress++;
					this.mbRow = this.macroblockAddress / this.mbWidth | 0;
					this.mbCol = this.macroblockAddress % this.mbWidth;
					this.copyMacroblock(this.motionFwH, this.motionFwV, this.forwardY, this.forwardCr, this.forwardCb);
					increment--;
				}
				this.macroblockAddress++;
			}
			this.mbRow = this.macroblockAddress / this.mbWidth | 0;
			this.mbCol = this.macroblockAddress % this.mbWidth;
			const mbTable = MPEG1.MACROBLOCK_TYPE[this.pictureType];
			this.macroblockType = this.readHuffman(mbTable);
			this.macroblockIntra = this.macroblockType & 1;
			this.macroblockMotFw = this.macroblockType & 8;
			if ((this.macroblockType & 16) !== 0) this.quantizerScale = this.bits.read(5);
			if (this.macroblockIntra) {
				this.motionFwH = this.motionFwHPrev = 0;
				this.motionFwV = this.motionFwVPrev = 0;
			} else {
				this.dcPredictorY = 128;
				this.dcPredictorCr = 128;
				this.dcPredictorCb = 128;
				this.decodeMotionVectors();
				this.copyMacroblock(this.motionFwH, this.motionFwV, this.forwardY, this.forwardCr, this.forwardCb);
			}
			const cbp = (this.macroblockType & 2) !== 0 ? this.readHuffman(MPEG1.CODE_BLOCK_PATTERN) : this.macroblockIntra ? 63 : 0;
			for (let block = 0, mask = 32; block < 6; block++) {
				if ((cbp & mask) !== 0) this.decodeBlock(block);
				mask >>= 1;
			}
		}
		decodeMotionVectors() {
			let code;
			let d;
			let r = 0;
			if (this.macroblockMotFw) {
				code = this.readHuffman(MPEG1.MOTION);
				if (code !== 0 && this.forwardF !== 1) {
					r = this.bits.read(this.forwardRSize);
					d = (Math.abs(code) - 1 << this.forwardRSize) + r + 1;
					if (code < 0) d = -d;
				} else d = code;
				this.motionFwHPrev += d;
				if (this.motionFwHPrev > (this.forwardF << 4) - 1) this.motionFwHPrev -= this.forwardF << 5;
				else if (this.motionFwHPrev < -this.forwardF << 4) this.motionFwHPrev += this.forwardF << 5;
				this.motionFwH = this.motionFwHPrev;
				if (this.fullPelForward) this.motionFwH <<= 1;
				code = this.readHuffman(MPEG1.MOTION);
				if (code !== 0 && this.forwardF !== 1) {
					r = this.bits.read(this.forwardRSize);
					d = (Math.abs(code) - 1 << this.forwardRSize) + r + 1;
					if (code < 0) d = -d;
				} else d = code;
				this.motionFwVPrev += d;
				if (this.motionFwVPrev > (this.forwardF << 4) - 1) this.motionFwVPrev -= this.forwardF << 5;
				else if (this.motionFwVPrev < -this.forwardF << 4) this.motionFwVPrev += this.forwardF << 5;
				this.motionFwV = this.motionFwVPrev;
				if (this.fullPelForward) this.motionFwV <<= 1;
			} else if (this.pictureType === MPEG1.PICTURE_TYPE.PREDICTIVE) {
				this.motionFwH = this.motionFwHPrev = 0;
				this.motionFwV = this.motionFwVPrev = 0;
			}
		}
		copyMacroblock(motionH, motionV, sY, sCr, sCb) {
			let width;
			let scan;
			let H;
			let V;
			let oddH;
			let oddV;
			let src;
			let dest;
			let last;
			const dY = this.currentY32;
			const dCb = this.currentCb32;
			const dCr = this.currentCr32;
			width = this.codedWidth;
			scan = width - 16;
			H = motionH >> 1;
			V = motionV >> 1;
			oddH = (motionH & 1) === 1;
			oddV = (motionV & 1) === 1;
			src = ((this.mbRow << 4) + V) * width + (this.mbCol << 4) + H;
			dest = this.mbRow * width + this.mbCol << 2;
			last = dest + (width << 2);
			let x;
			let y1;
			let y2;
			let y;
			if (oddH) {
				if (oddV) while (dest < last) {
					y1 = sY[src] + sY[src + width];
					src++;
					for (x = 0; x < 4; x++) {
						y2 = sY[src] + sY[src + width];
						src++;
						y = y1 + y2 + 2 >> 2 & 255;
						y1 = sY[src] + sY[src + width];
						src++;
						y |= y1 + y2 + 2 << 6 & 65280;
						y2 = sY[src] + sY[src + width];
						src++;
						y |= y1 + y2 + 2 << 14 & 16711680;
						y1 = sY[src] + sY[src + width];
						src++;
						y |= y1 + y2 + 2 << 22 & 4278190080;
						dY[dest++] = y;
					}
					dest += scan >> 2;
					src += scan - 1;
				}
				else while (dest < last) {
					y1 = sY[src++];
					for (x = 0; x < 4; x++) {
						y2 = sY[src++];
						y = y1 + y2 + 1 >> 1 & 255;
						y1 = sY[src++];
						y |= y1 + y2 + 1 << 7 & 65280;
						y2 = sY[src++];
						y |= y1 + y2 + 1 << 15 & 16711680;
						y1 = sY[src++];
						y |= y1 + y2 + 1 << 23 & 4278190080;
						dY[dest++] = y;
					}
					dest += scan >> 2;
					src += scan - 1;
				}
			} else if (oddV) while (dest < last) {
				for (x = 0; x < 4; x++) {
					y = sY[src] + sY[src + width] + 1 >> 1 & 255;
					src++;
					y |= sY[src] + sY[src + width] + 1 << 7 & 65280;
					src++;
					y |= sY[src] + sY[src + width] + 1 << 15 & 16711680;
					src++;
					y |= sY[src] + sY[src + width] + 1 << 23 & 4278190080;
					src++;
					dY[dest++] = y;
				}
				dest += scan >> 2;
				src += scan;
			}
			else while (dest < last) {
				for (x = 0; x < 4; x++) {
					y = sY[src];
					src++;
					y |= sY[src] << 8;
					src++;
					y |= sY[src] << 16;
					src++;
					y |= sY[src] << 24;
					src++;
					dY[dest++] = y;
				}
				dest += scan >> 2;
				src += scan;
			}
			width = this.halfWidth;
			scan = width - 8;
			H = motionH / 2 >> 1;
			V = motionV / 2 >> 1;
			oddH = (motionH / 2 & 1) === 1;
			oddV = (motionV / 2 & 1) === 1;
			src = ((this.mbRow << 3) + V) * width + (this.mbCol << 3) + H;
			dest = this.mbRow * width + this.mbCol << 1;
			last = dest + (width << 1);
			let cr1;
			let cr2;
			let cr;
			let cb1;
			let cb2;
			let cb;
			if (oddH) {
				if (oddV) while (dest < last) {
					cr1 = sCr[src] + sCr[src + width];
					cb1 = sCb[src] + sCb[src + width];
					src++;
					for (x = 0; x < 2; x++) {
						cr2 = sCr[src] + sCr[src + width];
						cb2 = sCb[src] + sCb[src + width];
						src++;
						cr = cr1 + cr2 + 2 >> 2 & 255;
						cb = cb1 + cb2 + 2 >> 2 & 255;
						cr1 = sCr[src] + sCr[src + width];
						cb1 = sCb[src] + sCb[src + width];
						src++;
						cr |= cr1 + cr2 + 2 << 6 & 65280;
						cb |= cb1 + cb2 + 2 << 6 & 65280;
						cr2 = sCr[src] + sCr[src + width];
						cb2 = sCb[src] + sCb[src + width];
						src++;
						cr |= cr1 + cr2 + 2 << 14 & 16711680;
						cb |= cb1 + cb2 + 2 << 14 & 16711680;
						cr1 = sCr[src] + sCr[src + width];
						cb1 = sCb[src] + sCb[src + width];
						src++;
						cr |= cr1 + cr2 + 2 << 22 & 4278190080;
						cb |= cb1 + cb2 + 2 << 22 & 4278190080;
						dCr[dest] = cr;
						dCb[dest] = cb;
						dest++;
					}
					dest += scan >> 2;
					src += scan - 1;
				}
				else while (dest < last) {
					cr1 = sCr[src];
					cb1 = sCb[src];
					src++;
					for (x = 0; x < 2; x++) {
						cr2 = sCr[src];
						cb2 = sCb[src++];
						cr = cr1 + cr2 + 1 >> 1 & 255;
						cb = cb1 + cb2 + 1 >> 1 & 255;
						cr1 = sCr[src];
						cb1 = sCb[src++];
						cr |= cr1 + cr2 + 1 << 7 & 65280;
						cb |= cb1 + cb2 + 1 << 7 & 65280;
						cr2 = sCr[src];
						cb2 = sCb[src++];
						cr |= cr1 + cr2 + 1 << 15 & 16711680;
						cb |= cb1 + cb2 + 1 << 15 & 16711680;
						cr1 = sCr[src];
						cb1 = sCb[src++];
						cr |= cr1 + cr2 + 1 << 23 & 4278190080;
						cb |= cb1 + cb2 + 1 << 23 & 4278190080;
						dCr[dest] = cr;
						dCb[dest] = cb;
						dest++;
					}
					dest += scan >> 2;
					src += scan - 1;
				}
			} else if (oddV) while (dest < last) {
				for (x = 0; x < 2; x++) {
					cr = sCr[src] + sCr[src + width] + 1 >> 1 & 255;
					cb = sCb[src] + sCb[src + width] + 1 >> 1 & 255;
					src++;
					cr |= sCr[src] + sCr[src + width] + 1 << 7 & 65280;
					cb |= sCb[src] + sCb[src + width] + 1 << 7 & 65280;
					src++;
					cr |= sCr[src] + sCr[src + width] + 1 << 15 & 16711680;
					cb |= sCb[src] + sCb[src + width] + 1 << 15 & 16711680;
					src++;
					cr |= sCr[src] + sCr[src + width] + 1 << 23 & 4278190080;
					cb |= sCb[src] + sCb[src + width] + 1 << 23 & 4278190080;
					src++;
					dCr[dest] = cr;
					dCb[dest] = cb;
					dest++;
				}
				dest += scan >> 2;
				src += scan;
			}
			else while (dest < last) {
				for (x = 0; x < 2; x++) {
					cr = sCr[src];
					cb = sCb[src];
					src++;
					cr |= sCr[src] << 8;
					cb |= sCb[src] << 8;
					src++;
					cr |= sCr[src] << 16;
					cb |= sCb[src] << 16;
					src++;
					cr |= sCr[src] << 24;
					cb |= sCb[src] << 24;
					src++;
					dCr[dest] = cr;
					dCb[dest] = cb;
					dest++;
				}
				dest += scan >> 2;
				src += scan;
			}
		}
		decodeBlock(block) {
			let n = 0;
			let quantMatrix;
			if (this.macroblockIntra) {
				let predictor;
				let dctSize;
				if (block < 4) {
					predictor = this.dcPredictorY;
					dctSize = this.readHuffman(MPEG1.DCT_DC_SIZE_LUMINANCE);
				} else {
					predictor = block === 4 ? this.dcPredictorCr : this.dcPredictorCb;
					dctSize = this.readHuffman(MPEG1.DCT_DC_SIZE_CHROMINANCE);
				}
				if (dctSize > 0) {
					const differential = this.bits.read(dctSize);
					if ((differential & 1 << dctSize - 1) !== 0) this.blockData[0] = predictor + differential;
					else this.blockData[0] = predictor + (-1 << dctSize | differential + 1);
				} else this.blockData[0] = predictor;
				if (block < 4) this.dcPredictorY = this.blockData[0];
				else if (block === 4) this.dcPredictorCr = this.blockData[0];
				else this.dcPredictorCb = this.blockData[0];
				this.blockData[0] <<= 8;
				quantMatrix = this.intraQuantMatrix;
				n = 1;
			} else quantMatrix = this.nonIntraQuantMatrix;
			let level = 0;
			while (true) {
				let run = 0;
				const coeff = this.readHuffman(MPEG1.DCT_COEFF);
				if (coeff === 1 && n > 0 && this.bits.read(1) === 0) break;
				if (coeff === 65535) {
					run = this.bits.read(6);
					level = this.bits.read(8);
					if (level === 0) level = this.bits.read(8);
					else if (level === 128) level = this.bits.read(8) - 256;
					else if (level > 128) level -= 256;
				} else {
					run = coeff >> 8;
					level = coeff & 255;
					if (this.bits.read(1)) level = -level;
				}
				n += run;
				const dezigZagged = MPEG1.ZIG_ZAG[n];
				n++;
				level <<= 1;
				if (!this.macroblockIntra) level += level < 0 ? -1 : 1;
				level = level * this.quantizerScale * quantMatrix[dezigZagged] >> 4;
				if ((level & 1) === 0) level -= level > 0 ? 1 : -1;
				if (level > 2047) level = 2047;
				else if (level < -2048) level = -2048;
				this.blockData[dezigZagged] = level * MPEG1.PREMULTIPLIER_MATRIX[dezigZagged];
			}
			let destArray;
			let destIndex;
			let scan;
			if (block < 4) {
				destArray = this.currentY;
				scan = this.codedWidth - 8;
				destIndex = this.mbRow * this.codedWidth + this.mbCol << 4;
				if ((block & 1) !== 0) destIndex += 8;
				if ((block & 2) !== 0) destIndex += this.codedWidth << 3;
			} else {
				destArray = block === 4 ? this.currentCb : this.currentCr;
				scan = (this.codedWidth >> 1) - 8;
				destIndex = (this.mbRow * this.codedWidth << 2) + (this.mbCol << 3);
			}
			if (this.macroblockIntra) {
				if (n === 1) {
					MPEG1.CopyValueToDestination(this.blockData[0] + 128 >> 8, destArray, destIndex, scan);
					this.blockData[0] = 0;
				} else {
					MPEG1.IDCT(this.blockData);
					MPEG1.CopyBlockToDestination(this.blockData, destArray, destIndex, scan);
					Fill(this.blockData, 0);
				}
			} else if (n === 1) {
				MPEG1.AddValueToDestination(this.blockData[0] + 128 >> 8, destArray, destIndex, scan);
				this.blockData[0] = 0;
			} else {
				MPEG1.IDCT(this.blockData);
				MPEG1.AddBlockToDestination(this.blockData, destArray, destIndex, scan);
				Fill(this.blockData, 0);
			}
			n = 0;
		}
		static CopyBlockToDestination(block, dest, index, scan) {
			for (let n = 0; n < 64; n += 8, index += scan + 8) {
				dest[index + 0] = block[n + 0];
				dest[index + 1] = block[n + 1];
				dest[index + 2] = block[n + 2];
				dest[index + 3] = block[n + 3];
				dest[index + 4] = block[n + 4];
				dest[index + 5] = block[n + 5];
				dest[index + 6] = block[n + 6];
				dest[index + 7] = block[n + 7];
			}
		}
		static AddBlockToDestination(block, dest, index, scan) {
			for (let n = 0; n < 64; n += 8, index += scan + 8) {
				dest[index + 0] += block[n + 0];
				dest[index + 1] += block[n + 1];
				dest[index + 2] += block[n + 2];
				dest[index + 3] += block[n + 3];
				dest[index + 4] += block[n + 4];
				dest[index + 5] += block[n + 5];
				dest[index + 6] += block[n + 6];
				dest[index + 7] += block[n + 7];
			}
		}
		static CopyValueToDestination(value, dest, index, scan) {
			for (let n = 0; n < 64; n += 8, index += scan + 8) {
				dest[index + 0] = value;
				dest[index + 1] = value;
				dest[index + 2] = value;
				dest[index + 3] = value;
				dest[index + 4] = value;
				dest[index + 5] = value;
				dest[index + 6] = value;
				dest[index + 7] = value;
			}
		}
		static AddValueToDestination(value, dest, index, scan) {
			for (let n = 0; n < 64; n += 8, index += scan + 8) {
				dest[index + 0] += value;
				dest[index + 1] += value;
				dest[index + 2] += value;
				dest[index + 3] += value;
				dest[index + 4] += value;
				dest[index + 5] += value;
				dest[index + 6] += value;
				dest[index + 7] += value;
			}
		}
		static IDCT(block) {
			let b1;
			let b3;
			let b4;
			let b6;
			let b7;
			let tmp1;
			let tmp2;
			let m0;
			let x0;
			let x1;
			let x2;
			let x3;
			let x4;
			let y3;
			let y4;
			let y5;
			let y6;
			let y7;
			for (let i = 0; i < 8; ++i) {
				b1 = block[32 + i];
				b3 = block[16 + i] + block[48 + i];
				b4 = block[40 + i] - block[24 + i];
				tmp1 = block[8 + i] + block[56 + i];
				tmp2 = block[24 + i] + block[40 + i];
				b6 = block[8 + i] - block[56 + i];
				b7 = tmp1 + tmp2;
				m0 = block[0 + i];
				x4 = (b6 * 473 - b4 * 196 + 128 >> 8) - b7;
				x0 = x4 - ((tmp1 - tmp2) * 362 + 128 >> 8);
				x1 = m0 - b1;
				x2 = ((block[16 + i] - block[48 + i]) * 362 + 128 >> 8) - b3;
				x3 = m0 + b1;
				y3 = x1 + x2;
				y4 = x3 + b3;
				y5 = x1 - x2;
				y6 = x3 - b3;
				y7 = -x0 - (b4 * 473 + b6 * 196 + 128 >> 8);
				block[0 + i] = b7 + y4;
				block[8 + i] = x4 + y3;
				block[16 + i] = y5 - x0;
				block[24 + i] = y6 - y7;
				block[32 + i] = y6 + y7;
				block[40 + i] = x0 + y5;
				block[48 + i] = y3 - x4;
				block[56 + i] = y4 - b7;
			}
			for (let i = 0; i < 64; i += 8) {
				b1 = block[4 + i];
				b3 = block[2 + i] + block[6 + i];
				b4 = block[5 + i] - block[3 + i];
				tmp1 = block[1 + i] + block[7 + i];
				tmp2 = block[3 + i] + block[5 + i];
				b6 = block[1 + i] - block[7 + i];
				b7 = tmp1 + tmp2;
				m0 = block[0 + i];
				x4 = (b6 * 473 - b4 * 196 + 128 >> 8) - b7;
				x0 = x4 - ((tmp1 - tmp2) * 362 + 128 >> 8);
				x1 = m0 - b1;
				x2 = ((block[2 + i] - block[6 + i]) * 362 + 128 >> 8) - b3;
				x3 = m0 + b1;
				y3 = x1 + x2;
				y4 = x3 + b3;
				y5 = x1 - x2;
				y6 = x3 - b3;
				y7 = -x0 - (b4 * 473 + b6 * 196 + 128 >> 8);
				block[0 + i] = b7 + y4 + 128 >> 8;
				block[1 + i] = x4 + y3 + 128 >> 8;
				block[2 + i] = y5 - x0 + 128 >> 8;
				block[3 + i] = y6 - y7 + 128 >> 8;
				block[4 + i] = y6 + y7 + 128 >> 8;
				block[5 + i] = x0 + y5 + 128 >> 8;
				block[6 + i] = y3 - x4 + 128 >> 8;
				block[7 + i] = y4 - b7 + 128 >> 8;
			}
		}
	};
	MPEG1.prototype.frameRate = 30;
	MPEG1.prototype.currentY = null;
	MPEG1.prototype.currentCr = null;
	MPEG1.prototype.currentCb = null;
	MPEG1.prototype.pictureType = 0;
	MPEG1.prototype.forwardY = null;
	MPEG1.prototype.forwardCr = null;
	MPEG1.prototype.forwardCb = null;
	MPEG1.prototype.fullPelForward = false;
	MPEG1.prototype.forwardFCode = 0;
	MPEG1.prototype.forwardRSize = 0;
	MPEG1.prototype.forwardF = 0;
	MPEG1.prototype.quantizerScale = 0;
	MPEG1.prototype.sliceBegin = false;
	MPEG1.prototype.macroblockAddress = 0;
	MPEG1.prototype.mbRow = 0;
	MPEG1.prototype.mbCol = 0;
	MPEG1.prototype.macroblockType = 0;
	MPEG1.prototype.macroblockIntra = false;
	MPEG1.prototype.macroblockMotFw = false;
	MPEG1.prototype.motionFwH = 0;
	MPEG1.prototype.motionFwV = 0;
	MPEG1.prototype.motionFwHPrev = 0;
	MPEG1.prototype.motionFwVPrev = 0;
	MPEG1.prototype.dcPredictorY = 0;
	MPEG1.prototype.dcPredictorCr = 0;
	MPEG1.prototype.dcPredictorCb = 0;
	MPEG1.prototype.blockData = null;
	MPEG1.PICTURE_RATE = [
		0,
		23.976,
		24,
		25,
		29.97,
		30,
		50,
		59.94,
		60,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	];
	MPEG1.ZIG_ZAG = new Uint8Array([
		0,
		1,
		8,
		16,
		9,
		2,
		3,
		10,
		17,
		24,
		32,
		25,
		18,
		11,
		4,
		5,
		12,
		19,
		26,
		33,
		40,
		48,
		41,
		34,
		27,
		20,
		13,
		6,
		7,
		14,
		21,
		28,
		35,
		42,
		49,
		56,
		57,
		50,
		43,
		36,
		29,
		22,
		15,
		23,
		30,
		37,
		44,
		51,
		58,
		59,
		52,
		45,
		38,
		31,
		39,
		46,
		53,
		60,
		61,
		54,
		47,
		55,
		62,
		63
	]);
	MPEG1.DEFAULT_INTRA_QUANT_MATRIX = new Uint8Array([
		8,
		16,
		19,
		22,
		26,
		27,
		29,
		34,
		16,
		16,
		22,
		24,
		27,
		29,
		34,
		37,
		19,
		22,
		26,
		27,
		29,
		34,
		34,
		38,
		22,
		22,
		26,
		27,
		29,
		34,
		37,
		40,
		22,
		26,
		27,
		29,
		32,
		35,
		40,
		48,
		26,
		27,
		29,
		32,
		35,
		40,
		48,
		58,
		26,
		27,
		29,
		34,
		38,
		46,
		56,
		69,
		27,
		29,
		35,
		38,
		46,
		56,
		69,
		83
	]);
	MPEG1.DEFAULT_NON_INTRA_QUANT_MATRIX = new Uint8Array([
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16
	]);
	MPEG1.PREMULTIPLIER_MATRIX = new Uint8Array([
		32,
		44,
		42,
		38,
		32,
		25,
		17,
		9,
		44,
		62,
		58,
		52,
		44,
		35,
		24,
		12,
		42,
		58,
		55,
		49,
		42,
		33,
		23,
		12,
		38,
		52,
		49,
		44,
		38,
		30,
		20,
		10,
		32,
		44,
		42,
		38,
		32,
		25,
		17,
		9,
		25,
		35,
		33,
		30,
		25,
		20,
		14,
		7,
		17,
		24,
		23,
		20,
		17,
		14,
		9,
		5,
		9,
		12,
		12,
		10,
		9,
		7,
		5,
		2
	]);
	MPEG1.MACROBLOCK_ADDRESS_INCREMENT = new Int16Array([
		3,
		6,
		0,
		9,
		12,
		0,
		0,
		0,
		1,
		15,
		18,
		0,
		21,
		24,
		0,
		27,
		30,
		0,
		33,
		36,
		0,
		0,
		0,
		3,
		0,
		0,
		2,
		39,
		42,
		0,
		45,
		48,
		0,
		0,
		0,
		5,
		0,
		0,
		4,
		51,
		54,
		0,
		57,
		60,
		0,
		0,
		0,
		7,
		0,
		0,
		6,
		63,
		66,
		0,
		69,
		72,
		0,
		75,
		78,
		0,
		81,
		84,
		0,
		-1,
		87,
		0,
		-1,
		90,
		0,
		93,
		96,
		0,
		99,
		102,
		0,
		105,
		108,
		0,
		111,
		114,
		0,
		0,
		0,
		9,
		0,
		0,
		8,
		117,
		120,
		0,
		123,
		126,
		0,
		129,
		132,
		0,
		135,
		138,
		0,
		0,
		0,
		15,
		0,
		0,
		14,
		0,
		0,
		13,
		0,
		0,
		12,
		0,
		0,
		11,
		0,
		0,
		10,
		141,
		-1,
		0,
		-1,
		144,
		0,
		147,
		150,
		0,
		153,
		156,
		0,
		159,
		162,
		0,
		165,
		168,
		0,
		171,
		174,
		0,
		177,
		180,
		0,
		183,
		-1,
		0,
		-1,
		186,
		0,
		189,
		192,
		0,
		195,
		198,
		0,
		201,
		204,
		0,
		207,
		210,
		0,
		213,
		216,
		0,
		219,
		222,
		0,
		0,
		0,
		21,
		0,
		0,
		20,
		0,
		0,
		19,
		0,
		0,
		18,
		0,
		0,
		17,
		0,
		0,
		16,
		0,
		0,
		35,
		0,
		0,
		34,
		0,
		0,
		33,
		0,
		0,
		32,
		0,
		0,
		31,
		0,
		0,
		30,
		0,
		0,
		29,
		0,
		0,
		28,
		0,
		0,
		27,
		0,
		0,
		26,
		0,
		0,
		25,
		0,
		0,
		24,
		0,
		0,
		23,
		0,
		0,
		22
	]);
	MPEG1.MACROBLOCK_TYPE_INTRA = new Int8Array([
		3,
		6,
		0,
		-1,
		9,
		0,
		0,
		0,
		1,
		0,
		0,
		17
	]);
	MPEG1.MACROBLOCK_TYPE_PREDICTIVE = new Int8Array([
		3,
		6,
		0,
		9,
		12,
		0,
		0,
		0,
		10,
		15,
		18,
		0,
		0,
		0,
		2,
		21,
		24,
		0,
		0,
		0,
		8,
		27,
		30,
		0,
		33,
		36,
		0,
		-1,
		39,
		0,
		0,
		0,
		18,
		0,
		0,
		26,
		0,
		0,
		1,
		0,
		0,
		17
	]);
	MPEG1.MACROBLOCK_TYPE_B = new Int8Array([
		3,
		6,
		0,
		9,
		15,
		0,
		12,
		18,
		0,
		24,
		21,
		0,
		0,
		0,
		12,
		27,
		30,
		0,
		0,
		0,
		14,
		39,
		42,
		0,
		36,
		33,
		0,
		0,
		0,
		4,
		0,
		0,
		6,
		54,
		48,
		0,
		45,
		51,
		0,
		0,
		0,
		8,
		0,
		0,
		10,
		-1,
		57,
		0,
		0,
		0,
		1,
		60,
		63,
		0,
		0,
		0,
		30,
		0,
		0,
		17,
		0,
		0,
		22,
		0,
		0,
		26
	]);
	MPEG1.MACROBLOCK_TYPE = [
		null,
		MPEG1.MACROBLOCK_TYPE_INTRA,
		MPEG1.MACROBLOCK_TYPE_PREDICTIVE,
		MPEG1.MACROBLOCK_TYPE_B
	];
	MPEG1.CODE_BLOCK_PATTERN = new Int16Array([
		6,
		3,
		0,
		9,
		18,
		0,
		12,
		15,
		0,
		24,
		33,
		0,
		36,
		39,
		0,
		27,
		21,
		0,
		30,
		42,
		0,
		60,
		57,
		0,
		54,
		48,
		0,
		69,
		51,
		0,
		81,
		75,
		0,
		63,
		84,
		0,
		45,
		66,
		0,
		72,
		78,
		0,
		0,
		0,
		60,
		105,
		120,
		0,
		132,
		144,
		0,
		114,
		108,
		0,
		126,
		141,
		0,
		87,
		93,
		0,
		117,
		96,
		0,
		0,
		0,
		32,
		135,
		138,
		0,
		99,
		123,
		0,
		129,
		102,
		0,
		0,
		0,
		4,
		90,
		111,
		0,
		0,
		0,
		8,
		0,
		0,
		16,
		0,
		0,
		44,
		150,
		168,
		0,
		0,
		0,
		28,
		0,
		0,
		52,
		0,
		0,
		62,
		183,
		177,
		0,
		156,
		180,
		0,
		0,
		0,
		1,
		165,
		162,
		0,
		0,
		0,
		61,
		0,
		0,
		56,
		171,
		174,
		0,
		0,
		0,
		2,
		0,
		0,
		40,
		153,
		186,
		0,
		0,
		0,
		48,
		192,
		189,
		0,
		147,
		159,
		0,
		0,
		0,
		20,
		0,
		0,
		12,
		240,
		249,
		0,
		0,
		0,
		63,
		231,
		225,
		0,
		195,
		219,
		0,
		252,
		198,
		0,
		0,
		0,
		24,
		0,
		0,
		36,
		0,
		0,
		3,
		207,
		261,
		0,
		243,
		237,
		0,
		204,
		213,
		0,
		210,
		234,
		0,
		201,
		228,
		0,
		216,
		222,
		0,
		258,
		255,
		0,
		264,
		246,
		0,
		-1,
		282,
		0,
		285,
		291,
		0,
		0,
		0,
		33,
		0,
		0,
		9,
		318,
		330,
		0,
		306,
		348,
		0,
		0,
		0,
		5,
		0,
		0,
		10,
		279,
		267,
		0,
		0,
		0,
		6,
		0,
		0,
		18,
		0,
		0,
		17,
		0,
		0,
		34,
		339,
		357,
		0,
		309,
		312,
		0,
		270,
		276,
		0,
		327,
		321,
		0,
		351,
		354,
		0,
		303,
		297,
		0,
		294,
		288,
		0,
		300,
		273,
		0,
		342,
		345,
		0,
		315,
		324,
		0,
		336,
		333,
		0,
		363,
		375,
		0,
		0,
		0,
		41,
		0,
		0,
		14,
		0,
		0,
		21,
		372,
		366,
		0,
		360,
		369,
		0,
		0,
		0,
		11,
		0,
		0,
		19,
		0,
		0,
		7,
		0,
		0,
		35,
		0,
		0,
		13,
		0,
		0,
		50,
		0,
		0,
		49,
		0,
		0,
		58,
		0,
		0,
		37,
		0,
		0,
		25,
		0,
		0,
		45,
		0,
		0,
		57,
		0,
		0,
		26,
		0,
		0,
		29,
		0,
		0,
		38,
		0,
		0,
		53,
		0,
		0,
		23,
		0,
		0,
		43,
		0,
		0,
		46,
		0,
		0,
		42,
		0,
		0,
		22,
		0,
		0,
		54,
		0,
		0,
		51,
		0,
		0,
		15,
		0,
		0,
		30,
		0,
		0,
		39,
		0,
		0,
		47,
		0,
		0,
		55,
		0,
		0,
		27,
		0,
		0,
		59,
		0,
		0,
		31
	]);
	MPEG1.MOTION = new Int16Array([
		3,
		6,
		0,
		12,
		9,
		0,
		0,
		0,
		0,
		18,
		15,
		0,
		24,
		21,
		0,
		0,
		0,
		-1,
		0,
		0,
		1,
		27,
		30,
		0,
		36,
		33,
		0,
		0,
		0,
		2,
		0,
		0,
		-2,
		42,
		45,
		0,
		48,
		39,
		0,
		60,
		54,
		0,
		0,
		0,
		3,
		0,
		0,
		-3,
		51,
		57,
		0,
		-1,
		69,
		0,
		81,
		75,
		0,
		78,
		63,
		0,
		72,
		66,
		0,
		96,
		84,
		0,
		87,
		93,
		0,
		-1,
		99,
		0,
		108,
		105,
		0,
		0,
		0,
		-4,
		90,
		102,
		0,
		0,
		0,
		4,
		0,
		0,
		-7,
		0,
		0,
		5,
		111,
		123,
		0,
		0,
		0,
		-5,
		0,
		0,
		7,
		114,
		120,
		0,
		126,
		117,
		0,
		0,
		0,
		-6,
		0,
		0,
		6,
		153,
		162,
		0,
		150,
		147,
		0,
		135,
		138,
		0,
		156,
		141,
		0,
		129,
		159,
		0,
		132,
		144,
		0,
		0,
		0,
		10,
		0,
		0,
		9,
		0,
		0,
		8,
		0,
		0,
		-8,
		171,
		198,
		0,
		0,
		0,
		-9,
		180,
		192,
		0,
		168,
		183,
		0,
		165,
		186,
		0,
		174,
		189,
		0,
		0,
		0,
		-10,
		177,
		195,
		0,
		0,
		0,
		12,
		0,
		0,
		16,
		0,
		0,
		13,
		0,
		0,
		14,
		0,
		0,
		11,
		0,
		0,
		15,
		0,
		0,
		-16,
		0,
		0,
		-12,
		0,
		0,
		-14,
		0,
		0,
		-15,
		0,
		0,
		-11,
		0,
		0,
		-13
	]);
	MPEG1.DCT_DC_SIZE_LUMINANCE = new Int8Array([
		6,
		3,
		0,
		18,
		15,
		0,
		9,
		12,
		0,
		0,
		0,
		1,
		0,
		0,
		2,
		27,
		24,
		0,
		21,
		30,
		0,
		0,
		0,
		0,
		36,
		33,
		0,
		0,
		0,
		4,
		0,
		0,
		3,
		39,
		42,
		0,
		0,
		0,
		5,
		0,
		0,
		6,
		48,
		45,
		0,
		51,
		-1,
		0,
		0,
		0,
		7,
		0,
		0,
		8
	]);
	MPEG1.DCT_DC_SIZE_CHROMINANCE = new Int8Array([
		6,
		3,
		0,
		12,
		9,
		0,
		18,
		15,
		0,
		24,
		21,
		0,
		0,
		0,
		2,
		0,
		0,
		1,
		0,
		0,
		0,
		30,
		27,
		0,
		0,
		0,
		3,
		36,
		33,
		0,
		0,
		0,
		4,
		42,
		39,
		0,
		0,
		0,
		5,
		48,
		45,
		0,
		0,
		0,
		6,
		51,
		-1,
		0,
		0,
		0,
		7,
		0,
		0,
		8
	]);
	MPEG1.DCT_COEFF = new Int32Array([
		3,
		6,
		0,
		12,
		9,
		0,
		0,
		0,
		1,
		21,
		24,
		0,
		18,
		15,
		0,
		39,
		27,
		0,
		33,
		30,
		0,
		42,
		36,
		0,
		0,
		0,
		257,
		60,
		66,
		0,
		54,
		63,
		0,
		48,
		57,
		0,
		0,
		0,
		513,
		51,
		45,
		0,
		0,
		0,
		2,
		0,
		0,
		3,
		81,
		75,
		0,
		87,
		93,
		0,
		72,
		78,
		0,
		96,
		90,
		0,
		0,
		0,
		1025,
		69,
		84,
		0,
		0,
		0,
		769,
		0,
		0,
		258,
		0,
		0,
		1793,
		0,
		0,
		65535,
		0,
		0,
		1537,
		111,
		108,
		0,
		0,
		0,
		1281,
		105,
		102,
		0,
		117,
		114,
		0,
		99,
		126,
		0,
		120,
		123,
		0,
		156,
		150,
		0,
		162,
		159,
		0,
		144,
		147,
		0,
		129,
		135,
		0,
		138,
		132,
		0,
		0,
		0,
		2049,
		0,
		0,
		4,
		0,
		0,
		514,
		0,
		0,
		2305,
		153,
		141,
		0,
		165,
		171,
		0,
		180,
		168,
		0,
		177,
		174,
		0,
		183,
		186,
		0,
		0,
		0,
		2561,
		0,
		0,
		3329,
		0,
		0,
		6,
		0,
		0,
		259,
		0,
		0,
		5,
		0,
		0,
		770,
		0,
		0,
		2817,
		0,
		0,
		3073,
		228,
		225,
		0,
		201,
		210,
		0,
		219,
		213,
		0,
		234,
		222,
		0,
		216,
		231,
		0,
		207,
		192,
		0,
		204,
		189,
		0,
		198,
		195,
		0,
		243,
		261,
		0,
		273,
		240,
		0,
		246,
		237,
		0,
		249,
		258,
		0,
		279,
		276,
		0,
		252,
		255,
		0,
		270,
		282,
		0,
		264,
		267,
		0,
		0,
		0,
		515,
		0,
		0,
		260,
		0,
		0,
		7,
		0,
		0,
		1026,
		0,
		0,
		1282,
		0,
		0,
		4097,
		0,
		0,
		3841,
		0,
		0,
		3585,
		315,
		321,
		0,
		333,
		342,
		0,
		312,
		291,
		0,
		375,
		357,
		0,
		288,
		294,
		0,
		-1,
		369,
		0,
		285,
		303,
		0,
		318,
		363,
		0,
		297,
		306,
		0,
		339,
		309,
		0,
		336,
		348,
		0,
		330,
		300,
		0,
		372,
		345,
		0,
		351,
		366,
		0,
		327,
		354,
		0,
		360,
		324,
		0,
		381,
		408,
		0,
		417,
		420,
		0,
		390,
		378,
		0,
		435,
		438,
		0,
		384,
		387,
		0,
		0,
		0,
		2050,
		396,
		402,
		0,
		465,
		462,
		0,
		0,
		0,
		8,
		411,
		399,
		0,
		429,
		432,
		0,
		453,
		414,
		0,
		426,
		423,
		0,
		0,
		0,
		10,
		0,
		0,
		9,
		0,
		0,
		11,
		0,
		0,
		5377,
		0,
		0,
		1538,
		0,
		0,
		771,
		0,
		0,
		5121,
		0,
		0,
		1794,
		0,
		0,
		4353,
		0,
		0,
		4609,
		0,
		0,
		4865,
		444,
		456,
		0,
		0,
		0,
		1027,
		459,
		450,
		0,
		0,
		0,
		261,
		393,
		405,
		0,
		0,
		0,
		516,
		447,
		441,
		0,
		516,
		519,
		0,
		486,
		474,
		0,
		510,
		483,
		0,
		504,
		498,
		0,
		471,
		537,
		0,
		507,
		501,
		0,
		522,
		513,
		0,
		534,
		531,
		0,
		468,
		477,
		0,
		492,
		495,
		0,
		549,
		546,
		0,
		525,
		528,
		0,
		0,
		0,
		263,
		0,
		0,
		2562,
		0,
		0,
		2306,
		0,
		0,
		5633,
		0,
		0,
		5889,
		0,
		0,
		6401,
		0,
		0,
		6145,
		0,
		0,
		1283,
		0,
		0,
		772,
		0,
		0,
		13,
		0,
		0,
		12,
		0,
		0,
		14,
		0,
		0,
		15,
		0,
		0,
		517,
		0,
		0,
		6657,
		0,
		0,
		262,
		540,
		543,
		0,
		480,
		489,
		0,
		588,
		597,
		0,
		0,
		0,
		27,
		609,
		555,
		0,
		606,
		603,
		0,
		0,
		0,
		19,
		0,
		0,
		22,
		591,
		621,
		0,
		0,
		0,
		18,
		573,
		576,
		0,
		564,
		570,
		0,
		0,
		0,
		20,
		552,
		582,
		0,
		0,
		0,
		21,
		558,
		579,
		0,
		0,
		0,
		23,
		612,
		594,
		0,
		0,
		0,
		25,
		0,
		0,
		24,
		600,
		615,
		0,
		0,
		0,
		31,
		0,
		0,
		30,
		0,
		0,
		28,
		0,
		0,
		29,
		0,
		0,
		26,
		0,
		0,
		17,
		0,
		0,
		16,
		567,
		618,
		0,
		561,
		585,
		0,
		654,
		633,
		0,
		0,
		0,
		37,
		645,
		648,
		0,
		0,
		0,
		36,
		630,
		636,
		0,
		0,
		0,
		34,
		639,
		627,
		0,
		663,
		666,
		0,
		657,
		624,
		0,
		651,
		642,
		0,
		669,
		660,
		0,
		0,
		0,
		35,
		0,
		0,
		267,
		0,
		0,
		40,
		0,
		0,
		268,
		0,
		0,
		266,
		0,
		0,
		32,
		0,
		0,
		264,
		0,
		0,
		265,
		0,
		0,
		38,
		0,
		0,
		269,
		0,
		0,
		270,
		0,
		0,
		33,
		0,
		0,
		39,
		0,
		0,
		7937,
		0,
		0,
		6913,
		0,
		0,
		7681,
		0,
		0,
		4098,
		0,
		0,
		7425,
		0,
		0,
		7169,
		0,
		0,
		271,
		0,
		0,
		274,
		0,
		0,
		273,
		0,
		0,
		272,
		0,
		0,
		1539,
		0,
		0,
		2818,
		0,
		0,
		3586,
		0,
		0,
		3330,
		0,
		0,
		3074,
		0,
		0,
		3842
	]);
	MPEG1.PICTURE_TYPE = {
		INTRA: 1,
		PREDICTIVE: 2,
		B: 3
	};
	MPEG1.START = {
		SEQUENCE: 179,
		SLICE_FIRST: 1,
		SLICE_LAST: 175,
		PICTURE: 0,
		EXTENSION: 181,
		USER_DATA: 178
	};
	// src/lib/mpeg1-wasm.js
	var MPEG1WASM = class extends BaseDecoder {
		constructor(options) {
			super(options);
			this.onDecodeCallback = options.onVideoDecode;
			this.module = options.wasmModule;
			this.bufferSize = options.videoBufferSize || 524288;
			this.bufferMode = options.streaming ? BitBuffer.MODE.EVICT : BitBuffer.MODE.EXPAND;
			this.decodeFirstFrame = options.decodeFirstFrame !== false;
			this.hasSequenceHeader = false;
		}
		initializeWasmDecoder() {
			if (!this.module.instance) {
				console.warn("JSMpeg: WASM module not compiled yet");
				return;
			}
			this.instance = this.module.instance;
			this.functions = this.module.instance.exports;
			this.decoder = this.functions._mpeg1_decoder_create(this.bufferSize, this.bufferMode);
		}
		destroy() {
			if (!this.decoder) return;
			this.functions._mpeg1_decoder_destroy(this.decoder);
		}
		bufferGetIndex() {
			if (!this.decoder) return;
			return this.functions._mpeg1_decoder_get_index(this.decoder);
		}
		bufferSetIndex(index) {
			if (!this.decoder) return;
			this.functions._mpeg1_decoder_set_index(this.decoder, index);
		}
		bufferWrite(buffers) {
			if (!this.decoder) this.initializeWasmDecoder();
			let totalLength = 0;
			for (let i = 0; i < buffers.length; i++) totalLength += buffers[i].length;
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
			if (!this.hasSequenceHeader && this.functions._mpeg1_decoder_has_sequence_header(this.decoder)) this.loadSequenceHeader();
		}
		loadSequenceHeader() {
			this.hasSequenceHeader = true;
			this.frameRate = this.functions._mpeg1_decoder_get_frame_rate(this.decoder);
			this.codedSize = this.functions._mpeg1_decoder_get_coded_size(this.decoder);
			if (this.destination) {
				const w = this.functions._mpeg1_decoder_get_width(this.decoder);
				const h = this.functions._mpeg1_decoder_get_height(this.decoder);
				this.destination.resize(w, h);
			}
			if (this.decodeFirstFrame) this.decode();
		}
		decode() {
			const startTime = Now();
			if (!this.decoder) return false;
			if (!this.functions._mpeg1_decoder_decode(this.decoder)) return false;
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
			if (this.onDecodeCallback) this.onDecodeCallback(this, elapsedTime);
			return true;
		}
	};
	// src/lib/ts.js
	var TS = class {
		constructor() {
			this.bits = null;
			this.leftoverBytes = null;
			this.guessVideoFrameEnd = true;
			this.pidsToStreamIds = {};
			this.pesPacketInfo = {};
			this.startTime = 0;
			this.currentTime = 0;
		}
		connect(streamId, destination) {
			this.pesPacketInfo[streamId] = {
				destination,
				currentLength: 0,
				totalLength: 0,
				pts: 0,
				buffers: []
			};
		}
		write(buffer) {
			if (this.leftoverBytes) {
				const totalLength = buffer.byteLength + this.leftoverBytes.byteLength;
				this.bits = new BitBuffer(totalLength);
				this.bits.write([this.leftoverBytes, buffer]);
			} else this.bits = new BitBuffer(buffer);
			while (this.bits.has(1504) && this.parsePacket());
			const leftoverCount = this.bits.byteLength - (this.bits.index >> 3);
			this.leftoverBytes = leftoverCount > 0 ? this.bits.bytes.subarray(this.bits.index >> 3) : null;
		}
		parsePacket() {
			if (this.bits.read(8) !== 71) {
				if (!this.resync()) return false;
			}
			const end = (this.bits.index >> 3) + 187;
			this.bits.read(1);
			const payloadStart = this.bits.read(1);
			this.bits.read(1);
			const pid = this.bits.read(13);
			this.bits.read(2);
			const adaptationField = this.bits.read(2);
			this.bits.read(4);
			let streamId = this.pidsToStreamIds[pid];
			if (payloadStart && streamId) {
				const pi = this.pesPacketInfo[streamId];
				if (pi && pi.currentLength) this.packetComplete(pi);
			}
			if (adaptationField & 1) {
				if (adaptationField & 2) {
					const adaptationFieldLength = this.bits.read(8);
					this.bits.skip(adaptationFieldLength << 3);
				}
				if (payloadStart && this.bits.nextBytesAreStartCode()) {
					this.bits.skip(24);
					streamId = this.bits.read(8);
					this.pidsToStreamIds[pid] = streamId;
					const packetLength = this.bits.read(16);
					this.bits.skip(8);
					const ptsDtsFlag = this.bits.read(2);
					this.bits.skip(6);
					const headerLength = this.bits.read(8);
					const payloadBeginIndex = this.bits.index + (headerLength << 3);
					const pi = this.pesPacketInfo[streamId];
					if (pi) {
						let pts = 0;
						if (ptsDtsFlag & 2) {
							this.bits.skip(4);
							const p32_30 = this.bits.read(3);
							this.bits.skip(1);
							const p29_15 = this.bits.read(15);
							this.bits.skip(1);
							const p14_0 = this.bits.read(15);
							this.bits.skip(1);
							pts = (p32_30 * 1073741824 + p29_15 * 32768 + p14_0) / 9e4;
							this.currentTime = pts;
							if (this.startTime === -1) this.startTime = pts;
						}
						const payloadLength = packetLength ? packetLength - headerLength - 3 : 0;
						this.packetStart(pi, pts, payloadLength);
					}
					this.bits.index = payloadBeginIndex;
				}
				if (streamId) {
					const pi = this.pesPacketInfo[streamId];
					if (pi) {
						const start = this.bits.index >> 3;
						const complete = this.packetAddData(pi, start, end);
						const hasPadding = !payloadStart && adaptationField & 2;
						if (complete || this.guessVideoFrameEnd && hasPadding) this.packetComplete(pi);
					}
				}
			}
			this.bits.index = end << 3;
			return true;
		}
		resync() {
			if (!this.bits.has(9024)) return false;
			const byteIndex = this.bits.index >> 3;
			for (let i = 0; i < 187; i++) if (this.bits.bytes[byteIndex + i] === 71) {
				let foundSync = true;
				for (let j = 1; j < 5; j++) if (this.bits.bytes[byteIndex + i + 188 * j] !== 71) {
					foundSync = false;
					break;
				}
				if (foundSync) {
					this.bits.index = byteIndex + i + 1 << 3;
					return true;
				}
			}
			console.warn("JSMpeg: Possible garbage data. Skipping.");
			this.bits.skip(1496);
			return false;
		}
		packetStart(pi, pts, payloadLength) {
			pi.totalLength = payloadLength;
			pi.currentLength = 0;
			pi.pts = pts;
		}
		packetAddData(pi, start, end) {
			pi.buffers.push(this.bits.bytes.subarray(start, end));
			pi.currentLength += end - start;
			return pi.totalLength !== 0 && pi.currentLength >= pi.totalLength;
		}
		packetComplete(pi) {
			pi.destination.write(pi.pts, pi.buffers);
			pi.totalLength = 0;
			pi.currentLength = 0;
			pi.buffers = [];
		}
	};
	TS.STREAM = {
		PACK_HEADER: 186,
		SYSTEM_HEADER: 187,
		PROGRAM_MAP: 188,
		PRIVATE_1: 189,
		PADDING: 190,
		PRIVATE_2: 191,
		AUDIO_1: 192,
		VIDEO_1: 224,
		DIRECTORY: 255
	};
	// src/lib/wasm-module.js
	var WASM = class WASM {
		constructor() {
			this.stackSize = 5242880;
			this.pageSize = 65536;
			this.onInitCallbacks = [];
			this.ready = false;
			this.loadingFromFileStarted = false;
			this.loadingFromBufferStarted = false;
		}
		write(buffer) {
			this.loadFromBuffer(buffer);
		}
		loadFromFile(url, callback) {
			if (callback) this.onInitCallbacks.push(callback);
			if (this.loadingFromFileStarted) return;
			this.loadingFromFileStarted = true;
			this.onInitCallback = callback;
			const ajax = new AjaxSource(url, {});
			ajax.connect(this);
			ajax.start();
		}
		loadFromBuffer(buffer, callback) {
			if (callback) this.onInitCallbacks.push(callback);
			if (this.loadingFromBufferStarted) return;
			this.loadingFromBufferStarted = true;
			this.moduleInfo = this.readDylinkSection(buffer);
			if (!this.moduleInfo) {
				for (let i = 0; i < this.onInitCallbacks.length; i++) this.onInitCallbacks[i](null);
				return;
			}
			this.memory = new WebAssembly.Memory({ initial: 256 });
			const env = {
				memory: this.memory,
				memoryBase: 0,
				__memory_base: 0,
				table: new WebAssembly.Table({
					initial: this.moduleInfo.tableSize,
					element: "anyfunc"
				}),
				tableBase: 0,
				__table_base: 0,
				abort: this.c_abort.bind(this),
				___assert_fail: this.c_assertFail.bind(this),
				_sbrk: this.c_sbrk.bind(this)
			};
			this.brk = this.align(this.moduleInfo.memorySize + this.stackSize);
			WebAssembly.instantiate(buffer, { env }).then((results) => {
				this.instance = results.instance;
				if (this.instance.exports.__post_instantiate) this.instance.exports.__post_instantiate();
				this.createHeapViews();
				this.ready = true;
				for (let i = 0; i < this.onInitCallbacks.length; i++) this.onInitCallbacks[i](this);
			});
		}
		createHeapViews() {
			this.instance.heapU8 = new Uint8Array(this.memory.buffer);
			this.instance.heapU32 = new Uint32Array(this.memory.buffer);
			this.instance.heapF32 = new Float32Array(this.memory.buffer);
		}
		align(addr) {
			const a = Math.pow(2, this.moduleInfo.memoryAlignment);
			return Math.ceil(addr / a) * a;
		}
		c_sbrk(size) {
			const previousBrk = this.brk;
			this.brk += size;
			if (this.brk > this.memory.buffer.byteLength) {
				const bytesNeeded = this.brk - this.memory.buffer.byteLength;
				const pagesNeeded = Math.ceil(bytesNeeded / this.pageSize);
				this.memory.grow(pagesNeeded);
				this.createHeapViews();
			}
			return previousBrk;
		}
		c_abort(size) {
			console.warn("JSMPeg: WASM abort", arguments);
		}
		c_assertFail(size) {
			console.warn("JSMPeg: WASM ___assert_fail", arguments);
		}
		readDylinkSection(buffer) {
			const bytes = new Uint8Array(buffer);
			let next = 0;
			const readVarUint = () => {
				let ret = 0;
				let mul = 1;
				while (1) {
					const byte = bytes[next++];
					ret += (byte & 127) * mul;
					mul *= 128;
					if (!(byte & 128)) return ret;
				}
			};
			const matchNextBytes = (expected) => {
				for (let i = 0; i < expected.length; i++) {
					const b = typeof expected[i] === "string" ? expected[i].charCodeAt(0) : expected[i];
					if (bytes[next++] !== b) return false;
				}
				return true;
			};
			if (!matchNextBytes([
				0,
				"a",
				"s",
				"m"
			])) {
				console.warn("JSMpeg: WASM header not found");
				return null;
			}
			next = 9;
			readVarUint();
			if (!matchNextBytes([
				6,
				"d",
				"y",
				"l",
				"i",
				"n",
				"k"
			])) {
				console.warn("JSMpeg: No dylink section found in WASM");
				return null;
			}
			return {
				memorySize: readVarUint(),
				memoryAlignment: readVarUint(),
				tableSize: readVarUint(),
				tableAlignment: readVarUint()
			};
		}
		static IsSupported() {
			return !!window.WebAssembly;
		}
		static GetModule() {
			WASM.CACHED_MODULE = WASM.CACHED_MODULE || new WASM();
			return WASM.CACHED_MODULE;
		}
	};
	// src/lib/wasm/WASM_BINARY.js
	var WASM_BINARY_default = "AGFzbQEAAAAADwZkeWxpbmuA0MACBAAAAAE0CWAEf39/fwBgAX8Bf2ACf38Bf2ABfwBgAn9/AGABfwF9YAZ/f39/f38AYAN/f38Bf2AAAAJGBANlbnYOX19fYXNzZXJ0X2ZhaWwAAANlbnYFX3NicmsAAQNlbnYNX19tZW1vcnlfYmFzZQN/AANlbnYGbWVtb3J5AgCAAgM9PAIDAgEEBAMBBQEBAQEBAQEDBAMGAwQAAwAAAAIDAgEEBAEBAQEBAAACAwIBAgECAQEBAQMEAwMCBwcHCAYLAn8BQQALfwFBAAsHggYfEl9fcG9zdF9pbnN0YW50aWF0ZQA9BV9mcmVlADgHX21hbGxvYwAxB19tZW1jcHkAOghfbWVtbW92ZQA7B19tZW1zZXQAPBNfbXAyX2RlY29kZXJfY3JlYXRlAB0TX21wMl9kZWNvZGVyX2RlY29kZQAmFF9tcDJfZGVjb2Rlcl9kZXN0cm95AB4WX21wMl9kZWNvZGVyX2RpZF93cml0ZQAiFl9tcDJfZGVjb2Rlcl9nZXRfaW5kZXgAICFfbXAyX2RlY29kZXJfZ2V0X2xlZnRfY2hhbm5lbF9wdHIAJCJfbXAyX2RlY29kZXJfZ2V0X3JpZ2h0X2NoYW5uZWxfcHRyACUcX21wMl9kZWNvZGVyX2dldF9zYW1wbGVfcmF0ZQAjGl9tcDJfZGVjb2Rlcl9nZXRfd3JpdGVfcHRyAB8WX21wMl9kZWNvZGVyX3NldF9pbmRleAAhFV9tcGVnMV9kZWNvZGVyX2NyZWF0ZQACFV9tcGVnMV9kZWNvZGVyX2RlY29kZQARFl9tcGVnMV9kZWNvZGVyX2Rlc3Ryb3kAAxhfbXBlZzFfZGVjb2Rlcl9kaWRfd3JpdGUABxlfbXBlZzFfZGVjb2Rlcl9nZXRfY2JfcHRyABAdX21wZWcxX2RlY29kZXJfZ2V0X2NvZGVkX3NpemUACxlfbXBlZzFfZGVjb2Rlcl9nZXRfY3JfcHRyAA8dX21wZWcxX2RlY29kZXJfZ2V0X2ZyYW1lX3JhdGUAChlfbXBlZzFfZGVjb2Rlcl9nZXRfaGVpZ2h0AA0YX21wZWcxX2RlY29kZXJfZ2V0X2luZGV4AAUYX21wZWcxX2RlY29kZXJfZ2V0X3dpZHRoAAwcX21wZWcxX2RlY29kZXJfZ2V0X3dy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BQJ/IANBzQBHDQIgACgCgAFBBhAwIQMCQAJAIAAoAoABQQgQMCIEIgYEQCAGQYABRgRADAIFDAMLAAsgACgCgAFBCBAwDAILIAAoAoABQQgQMEGAfmoMAQsgBEGAfmogBCAEQYABShsLCyEEDAELIAZB/wFxIgNBACADayAAKAKAAUEBEDBFGyEEIAZBCHUhAwsgAiADaiIGIwBBQGtqLQAAIgMgBWotAAAgACgCREEAIARBAXQiAkEfdUEBciAAKAJcGyACamxsIgJBBHVBAEEBQX8gAkEPShsgAkEQcRtrIgJBgHAgAkGAcEobIQIgAEGcAWogA0ECdGogAyMAQZA1amotAAAgAkH/DyACQf8PSBtsNgIAIAZBAWohAgwBCwsgAUEESARAIABBhAFqIQUgAUEDdEEIcSAAKAJUIAAoAhgiAyAAKAJQbGpBBHRyIANBA3RBACABQQJxG2ohBAUgAEGMAWogAEGIAWogAUEERhshBSAAKAJQIAAoAhgiAUECdGwgACgCVEEDdGohBCABQQF1IQMLIANBeGohAyAFKAIAIQUgAkEBRiECIABBnAFqIQEgACgCXARAIAIEQCABKAIAQYABakEIdSAFIAQgAxAYIAFBADYCAAUgARAZIAEgBSAEIAMQGiABQQBBgAIQPBoLBSACBEAgASgCAEGAAWpBCHUgBSAEIAMQGyABQQA2AgAFIAEQGSABIAUgBCADEBwgAUEAQYACEDwaCwsL7AYAIAEgAmogAEEAIABBAEobIgBB/wEgAEH/AUgbQf8BcSIAOgAAIAEgAkEBamogADoAACABIAJBAmpqIAA6AAAgASACQQNqaiAAOgAAIAEgAkEEamogADoAACABIAJBBWpqIAA6AAAgASACQQZqaiAAOgAAIAEgAkEHamogADoAACABIAIgA0EIaiIDaiICaiAAOgAAIAEgAkEBamogADoAACABIAJBAmpqIAA6AAAgASACQQNqaiAAOgAAIAEgAkEEamogADoAACABIAJBBWpqIAA6AAAgASACQQZqaiAAOgAAIAEgAkEHamogADoAACABIAIgA2oiAmogADoAACABIAJBAWpqIAA6AAAgASACQQJqaiAAOgAAIAEgAkEDamogADoAACABIAJBBGpqIAA6AAAgASACQQVqaiAAOgAAIAEgAkEGamogADoAACABIAJBB2pqIAA6AAAgASACIANqIgJqIAA6AAAgASACQQFqaiAAOgAAIAEgAkECamogADoAACABIAJBA2pqIAA6AAAgASACQQRqaiAAOgAAIAEgAkEFamogADoAACABIAJBBmpqIAA6AAAgASACQQdqaiAAOgAAIAEgAiADaiICaiAAOgAAIAEgAkEBamogADoAACABIAJBAmpqIAA6AAAgASACQQNqaiAAOgAAIAEgAkEEamogADoAACABIAJBBWpqIAA6AAAgASACQQZqaiAAOgAAIAEgAkEHamogADoAACABIAIgA2oiAmogADoAACABIAJBAWpqIAA6AAAgASACQQJqaiAAOgAAIAEgAkEDamogADoAACABIAJBBGpqIAA6AAAgASACQQVqaiAAOgAAIAEgAkEGamogADoAACABIAJBB2pqIAA6AAAgASACIANqIgJqIAA6AAAgASACQQFqaiAAOgAAIAEgAkECamogADoAACABIAJBA2pqIAA6AAAgASACQQRqaiAAOgAAIAEgAkEFamogADoAACABIAJBBmpqIAA6AAAgASACQQdqaiAAOgAAIAEgAiADaiICaiAAOgAAIAEgAkEBamogADoAACABIAJBAmpqIAA6AAAgASACQQNqaiAAOgAAIAEgAkEEamogADoAACABIAJBBWpqIAA6AAAgASACQQZqaiAAOgAAIAEgAkEHamogADoAAAubBgEUfwNAIAFBEGpBAnQgAGoiBygCACIGIAFBMGpBAnQgAGoiDSgCACIJaiEFIAFBCGpBAnQgAGoiDigCACICIAFBOGpBAnQgAGoiDygCACIDaiEEIAIgA2siEEHZA2wgAUEoakECdCAAaiIKKAIAIgIgAUEYakECdCAAaiIRKAIAIgNrIgtBvH5sQYABampBCHUgBCACIANqIghqIgJrIgMgBCAIa0HqAmxBgAFqQQh1ayEEIAFBAnQgAGoiCCgCACIMIAFBIGpBAnQgAGoiEigCACITayIUIAYgCWtB6gJsQYABakEIdSAFayIJaiEGIAggAiAMIBNqIgggBWoiDGo2AgAgDiADIAZqNgIAIAcgFCAJayIHIARrNgIAIBEgC0HZA2xBgAFqIBBBxAFsakEIdSAEaiIJIAggBWsiBWo2AgAgEiAFIAlrNgIAIAogBCAHajYCACANIAYgA2s2AgAgDyAMIAJrNgIAIAFBAWoiAUEIRw0AC0EAIQEDQCABQQFyQQJ0IABqIgcoAgAiBCABQQdyQQJ0IABqIg0oAgAiAmohBSAEIAJrIglB2QNsIAFBBXJBAnQgAGoiDigCACIEIAFBA3JBAnQgAGoiDygCACICayIQQbx+bEGAAWpqQQh1IAUgAiAEaiIDaiIEayICIAUgA2tB6gJsQYABakEIdWshBSABQQJ0IABqIgYoAgAiCiABQQRyQQJ0IABqIhEoAgAiC2shAyAGIAogC2oiCiABQQJyQQJ0IABqIgsoAgAiCCABQQZyQQJ0IABqIgwoAgAiEmoiBmoiEyAEQYABampBCHU2AgAgByADIAggEmtB6gJsQYABakEIdSAGayIHakGAAWoiCCACakEIdTYCACALIAMgB2tBgAFqIgMgBWtBCHU2AgAgDyAQQdkDbEGAAWogCUHEAWxqQQh1IAVqIgcgCiAGa0GAAWoiBmpBCHU2AgAgESAGIAdrQQh1NgIAIA4gAyAFakEIdTYCACAMIAggAmtBCHU2AgAgDSATQYABIARrakEIdTYCACABQQhqIgFBwABJDQALC5gDAQJ/IANBCGohBUEAIQMDQCABIAJqIANBAnQgAGooAgAiBEEAIARBAEobIgRB/wEgBEH/AUgbOgAAIAEgAkEBamogA0EBckECdCAAaigCACIEQQAgBEEAShsiBEH/ASAEQf8BSBs6AAAgASACQQJqaiADQQJyQQJ0IABqKAIAIgRBACAEQQBKGyIEQf8BIARB/wFIGzoAACABIAJBA2pqIANBA3JBAnQgAGooAgAiBEEAIARBAEobIgRB/wEgBEH/AUgbOgAAIAEgAkEEamogA0EEckECdCAAaigCACIEQQAgBEEAShsiBEH/ASAEQf8BSBs6AAAgASACQQVqaiADQQVyQQJ0IABqKAIAIgRBACAEQQBKGyIEQf8BIARB/wFIGzoAACABIAJBBmpqIANBBnJBAnQgAGooAgAiBEEAIARBAEobIgRB/wEgBEH/AUgbOgAAIAEgAkEHamogA0EHckECdCAAaigCACIEQQAgBEEAShsiBEH/ASAEQf8BSBs6AAAgAiAFaiECIANBCGoiA0HAAEkNAAsLiwMBA38gA0EIaiEGQQAhAwNAIAAgASACaiIFLQAAaiIEQQAgBEEAShshBCAFIARB/wEgBEH/AUgbOgAAIAAgASACQQFqaiIFLQAAaiIEQQAgBEEAShshBCAFIARB/wEgBEH/AUgbOgAAIAAgASACQQJqaiIFLQAAaiIEQQAgBEEAShshBCAFIARB/wEgBEH/AUgbOgAAIAAgASACQQNqaiIFLQAAaiIEQQAgBEEAShshBCAFIARB/wEgBEH/AUgbOgAAIAAgASACQQRqaiIFLQAAaiIEQQAgBEEAShshBCAFIARB/wEgBEH/AUgbOgAAIAAgASACQQVqaiIFLQAAaiIEQQAgBEEAShshBCAFIARB/wEgBEH/AUgbOgAAIAAgASACQQZqaiIFLQAAaiIEQQAgBEEAShshBCAFIARB/wEgBEH/AUgbOgAAIAAgASACQQdqaiIFLQAAaiIEQQAgBEEAShshBCAFIARB/wEgBEH/AUgbOgAAIAIgBmohAiADQQhqIgNBwABJDQALC+gDAQN/IANBCGohBkEAIQMDQCADQQJ0IABqKAIAIAEgAmoiBS0AAGoiBEEAIARBAEobIQQgBSAEQf8BIARB/wFIGzoAACADQQFyQQJ0IABqKAIAIAEgAkEBamoiBS0AAGoiBEEAIARBAEobIQQgBSAEQf8BIARB/wFIGzoAACADQQJyQQJ0IABqKAIAIAEgAkECamoiBS0AAGoiBEEAIARBAEobIQQgBSAEQf8BIARB/wFIGzoAACADQQNyQQJ0IABqKAIAIAEgAkEDamoiBS0AAGoiBEEAIARBAEobIQQgBSAEQf8BIARB/wFIGzoAACADQQRyQQJ0IABqKAIAIAEgAkEEamoiBS0AAGoiBEEAIARBAEobIQQgBSAEQf8BIARB/wFIGzoAACADQQVyQQJ0IABqKAIAIAEgAkEFamoiBS0AAGoiBEEAIARBAEobIQQgBSAEQf8BIARB/wFIGzoAACADQQZyQQJ0IABqKAIAIAEgAkEGamoiBS0AAGoiBEEAIARBAEobIQQgBSAEQf8BIARB/wFIGzoAACADQQdyQQJ0IABqKAIAIAEgAkEHamoiBS0AAGoiBEEAIARBAEobIQQgBSAEQf8BIARB/wFIGzoAACACIAZqIQIgA0EIaiIDQcAASQ0ACwtUAQF/Qcy3ARAxIgJBBGpBAEHItwEQPBogAiAAIAEQKjYCCCACQcTYAjYCACACQczWAGojAEHQNWpBgBAQOhogAkHM5gBqIwBB0DVqQYAQEDoaIAILDQAgACgCCBArIAAQOAsLACAAKAIIIAEQLAsKACAAKAIIKAIECwwAIAAoAgggATYCBAsUACAAKAIIIgAgASAAKAIMajYCDAsHACAAKAIACwgAIABBzA5qCwgAIABBzDJqC0UBAn8gACgCCCgCBCECIAAoAggiASgCDEEDdCABKAIEa0EQSQRAQQAPCyAAECchASAAKAIIIAFBA3QgAmpBeHE2AgQgAQuVGgEffyAAKAIIQQsQMCAAKAIIQQIQMCECIAAoAghBAhAwIQEgACgCCEEBEDAhB0H/D0cgAkEDR3IgAUECR3IEQEEADwsgACgCCEEEEDAiAkEOSgRAQQAPCyAAKAIIQQIQMCINQQNGBEBBAA8LIAAoAghBARAwIAAoAghBARAwGiAAKAIIQQIQMCEKIAAoAgghASAKQQFGBH8gAUECEDBBAnRBBGoFIAEgASgCBEECajYCBEEAQSAgCkEDRhsLIQwgACgCCCIBIAEoAgRBBGo2AgQgB0UEQCAAKAIIIgEgASgCBEEQajYCBAsjAEHQxQBqIAJBf2oiAUEBdGouAQBBgOUIbCMAQZDGAGogDUEBdGovAQAiF20gDSMAQdzIAGogASMAQaDGAGogCkEDR0EEdGpqLQAAQQNsamotAAAiAUE/cSELIAFBBnYhCCALIAwgDCALShsiDUEASiIYBEBBACEBA0AgASMAQcDGAGogCEEFdGpqLQAAIgJBD3EhBSAAKAIIIAJBBHYiAhAwIwBBoMcAaiAFQQR0amosAAAhAyAAQQxqIAFBAnRqIwAgA0H/AXFBAnRqQfzHAGpBACADGzYCACAAKAIIIAIQMCMAQaDHAGogBUEEdGpqLAAAIQIgAEGMAWogAUECdGojACACQf8BcUECdGpB/McAakEAIAIbNgIAIAFBAWoiASANSA0ACwsgCyAMSiIZBEAgDSEBA0AgACgCCCABIwBBwMYAaiAIQQV0amotAAAiAkEEdhAwIwBBoMcAaiACQQ9xQQR0amosAAAhAiAAQYwBaiABQQJ0aiMAIAJB/wFxQQJ0akH8xwBqQQAgAhsiAjYCACAAQQxqIAFBAnRqIAI2AgAgAUEBaiIBIAtIDQALC0EBQQIgCkEDRiIFGyEIIAtFIgJFBEAgBQRAQQAhAQNAQQAhAwNAIABBDGogA0EHdGogAUECdGooAgAEQCABIABBjAJqIANBBXRqaiAAKAIIQQIQMDoAAAsgA0EBaiIDIAhJDQALIAEgAEGsAmpqIAEgAEGMAmpqLAAAOgAAIAFBAWoiASALRw0ACwVBACEBA0BBACEDA0AgAEEMaiADQQd0aiABQQJ0aigCAARAIAEgAEGMAmogA0EFdGpqIAAoAghBAhAwOgAACyADQQFqIgMgCEkNAAsgAUEBaiIBIAtHDQALCyACRQRAIAUEQEEAIQEDQEEAIQMDQCAAQQxqIANBB3RqIAFBAnRqKAIABEACQCAAQcwCaiADQYADbGogAUEMbGohBQJAAkACQAJAAkAgASAAQYwCaiADQQV0amosAAAOBAABAgMECyAFIAAoAghBBhAwNgIAIAAgA0GAA2xqIAFBDGxqIAAoAghBBhAwNgLQAiAAIANBgANsaiABQQxsaiAAKAIIQQYQMDYC1AIMBAsgACADQYADbGogAUEMbGogACgCCEEGEDAiAjYC0AIgBSACNgIAIAAgA0GAA2xqIAFBDGxqIAAoAghBBhAwNgLUAgwDCyAAIANBgANsaiABQQxsaiAAKAIIQQYQMCICNgLUAiAAIANBgANsaiABQQxsaiACNgLQAiAFIAI2AgAMAgsgBSAAKAIIQQYQMDYCACAAIANBgANsaiABQQxsaiAAKAIIQQYQMCICNgLUAiAAIANBgANsaiABQQxsaiACNgLQAgsLCyADQQFqIgMgCEkNAAsgAEHMBWogAUEMbGogAEHMAmogAUEMbGooAgA2AgAgACABQQxsaiAAIAFBDGxqKALQAjYC0AUgACABQQxsaiAAIAFBDGxqKALUAjYC1AUgAUEBaiIBIAtHDQALBUEAIQEDQEEAIQMDQCAAQQxqIANBB3RqIAFBAnRqKAIABEACQCAAQcwCaiADQYADbGogAUEMbGohBQJAAkACQAJAAkAgASAAQYwCaiADQQV0amosAAAOBAABAgMECyAFIAAoAghBBhAwNgIAIAAgA0GAA2xqIAFBDGxqIAAoAghBBhAwNgLQAiAAIANBgANsaiABQQxsaiAAKAIIQQYQMDYC1AIMBAsgACADQYADbGogAUEMbGogACgCCEEGEDAiAjYC0AIgBSACNgIAIAAgA0GAA2xqIAFBDGxqIAAoAghBBhAwNgLUAgwDCyAAIANBgANsaiABQQxsaiAAKAIIQQYQMCICNgLUAiAAIANBgANsaiABQQxsaiACNgLQAiAFIAI2AgAMAgsgBSAAKAIIQQYQMDYCACAAIANBgANsaiABQQxsaiAAKAIIQQYQMCICNgLUAiAAIANBgANsaiABQQxsaiACNgLQAgsLCyADQQFqIgMgCEkNAAsgAUEBaiIBIAtHDQALCwsLaiALQSBJIRsgAEHMtgFqIQQgAEHMCGohHCAAQcz2AGohHSAAQcwLaiEeIABBzJYBaiEfA0BBACEWIBQhAwNAIBgEQEEAIQEDQCAAQQAgASAOECggAEEBIAEgDhAoIAFBAWoiASANSA0ACwsgGQRAIA0hAQNAIABBACABIA4QKCAAQcwLaiABQQxsaiAAQcwIaiABQQxsaigCADYCACAAIAFBDGxqQdALaiAAIAFBDGxqQdAIaigCADYCACAAIAFBDGxqQdQLaiAAIAFBDGxqQdQIaigCADYCACABQQFqIgEgC0gNAAsLIBsEQCALIQEDQCAAQcwIaiABQQxsakEANgIAIAAgAUEMbGpB0AhqQQA2AgAgACABQQxsakHUCGpBADYCACAAQcwLaiABQQxsakEANgIAIAAgAUEMbGpB0AtqQQA2AgAgACABQQxsakHUC2pBADYCACABQQFqIgFBIEcNAAsLIAAoAgQhASADIRFBACESA0AgACABQcAHakH/B3EiATYCBCAcIBIgHSABECkgBEIANwIAIARCADcCCCAEQgA3AhAgBEIANwIYIARCADcCICAEQgA3AiggBEIANwIwIARCADcCOCAEQUBrQgA3AgAgBEIANwJIIARCADcCUCAEQgA3AlggBEIANwJgIARCADcCaCAEQgA3AnAgBEIANwJ4IAAoAgQiD0EBdSETQf8HIA9BgAFvQQF1IgxrIgFBgH9xIRUgAUEHdkEGdEHABGohEEGABCATayEGIAwhAQNAIAYhB0EAIQkgASECA0AgB0EBaiEIIAJBAWohBSAAQcy2AWogCUECdGoiCiAAQczWAGogB0ECdGoqAgAgAEHM9gBqIAJBAnRqKgIAlCAKKAIAspKoNgIAIAlBAWoiCUEgRwRAIAghByAFIQIMAQsLIAFBgAFqIQIgBkFAayEGIAFBgAdIBEAgAiEBDAELC0HgByAMIBVqayIBQYAISARAIBAgE2tBoHxqIQYD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IkogWCBLk7tEujBFka7n9D+itiJLk7tEuEt/Zp6g5j+itiI6kiEqIANBMGpBAnQgAmogTSA8kow4AgAgA0EvakECdCACaiApICiSIEwgSZIgJJIiKJKMIik4AgAgA0ExakECdCACaiApOAIAIANBLmpBAnQgAmogRiBFkiAjkowiKTgCACADQTJqQQJ0IAJqICk4AgAgA0EtakECdCACaiAwIC2SIEAgPpIgJpIiKZIiPCAokowiKDgCACADQTNqQQJ0IAJqICg4AgAgA0EsakECdCACaiA2IE+SIFEgUJIgNZIiKJKMIjY4AgAgA0E0akECdCACaiA2OAIAIANBK2pBAnQgAmogPCA/IDiSIDOSIjwgJJIiJJKMIjY4AgAgA0E1akECdCACaiA2OAIAIANBKmpBAnQgAmogPSBSkiA7kiI9ICOSjCIjOAIAIANBNmpBAnQgAmogIzgCACADQSlqQQJ0IAJqIEsgSpIgOpIiIyAkkowiJDgCACADQTdqQQJ0IAJqICQ4AgAgA0EoakECdCACaiBIIE6SIDGSjCIkOAIAIANBOGpBAnQgAmogJDgCACADQSdqQQJ0IAJqICMgPCArkiIjkowiJDgCACADQTlqQQJ0IAJqICQ4AgAgA0EmakECdCACaiA9ICeSjCIkOAIAIANBOmpBAnQgAmogJDgCACADQSVqQQJ0IAJqICkgLSAwk7tEuEt/Zp6g5j+itiIpkiItICOSjCIjOAIAIANBO2pBAnQgAmogIzgCACADQSRqQQJ0IAJqICggR5KMIiM4AgAgA0E8akECdCACaiAjOAIAIANBI2pBAnQgAmogLSArIDKSIiOSjCIoOAIAIANBPWpBAnQgAmogKDgCACADQSJqQQJ0IAJqICcgU5KMIic4AgAgA0E+akECdCACaiAnOAIAIANBIWpBAnQgAmogIyBCkowiIzgCACADQT9qQQJ0IAJqICM4AgAgA0EgakECdCACaiA0jDgCACADQQJ0IAJqIDQ4AgAgA0EfakECdCACaiAsjDgCACADQQFqQQJ0IAJqICw4AgAgA0EeakECdCACaiA5jDgCACADQQJqQQJ0IAJqIDk4AgAgA0EdakECdCACaiApICaSIjQgQZIiI4w4AgAgA0EDakECdCACaiAjOAIAIANBHGpBAnQgAmogL4w4AgAgA0EEakECdCACaiAvOAIAIANBG2pBAnQgAmogNCA3IDOSIjSSIi+MOAIAIANBBWpBAnQgAmogLzgCACADQRpqQQJ0IAJqIEQgO5IiL4w4AgAgA0EGakECdCACaiAvOAIAIANBGWpBAnQgAmogNCA6kiI0jDgCACADQQdqQQJ0IAJqIDQ4AgAgA0EYakECdCACaiAxjDgCACADQQhqQQJ0IAJqIDE4AgAgA0EXakECdCACaiAqjDgCACADQQlqQQJ0IAJqICo4AgAgA0EWakECdCACaiA7IC6SIjGMOAIAIANBCmpBAnQgAmogMTgCACADQRVqQQJ0IAJqIEMgJpIiMYw4AgAgA0ELakECdCACaiAxOAIAIANBFGpBAnQgAmogNYw4AgAgA0EMakECdCACaiA1OAIAIANBE2pBAnQgAmogJiAlkiImjDgCACADQQ1qQQJ0IAJqICY4AgAgA0ESakECdCACaiAujDgCACADQQ5qQQJ0IAJqIC44AgAgA0ERakECdCACaiAljDgCACADQQ9qQQJ0IAJqICU4AgAgA0EQakECdCACakMAAAAAOAIACy8BAX9BFBAxIgIgATYCECACIAAQMTYCACACIAA2AgggAkEANgIMIAJBADYCBCACCw0AIAAoAgAQOCAAEDgL6QEBBH8gACgCCCIDIAAoAgwiAmsiBCABSQRAAkAgACgCEEECRgRAIAAgACgCACABIARrIANBAXQiAiACIARqIAFJGyIBEDk2AgAgACABNgIIIAAoAgQgACgCDCIBQQN0IgJNDQEgACACNgIEDAELIAIgACgCBCIFQQN2IgNGIAMgBGogAUlyBEAgAEEANgIMIABBADYCBEEAIQEMAQsgAwRAIAAoAgAiASABIANqIAIgA2sQOxogACAAKAIMIANrIgE2AgwgACAAKAIEIAVBeHFrNgIEBSACIQELCwUgAiEBCyAAKAIAIAFqC40BAQR/IAAoAgRBB2pBA3YiASAAKAIMIgRJBEACQCAAKAIAIQIDQAJAIAFBAWohAyABIAJqLAAARQRAIAIgA2osAABFBEAgAiABQQJqaiwAAEEBRg0CCwsgAyAETw0CIAMhAQwBCwsgACABQQN0QSBqNgIEIAIgAUEDamotAAAPCwsgACAEQQN0NgIEQX8LqQEBBH8gACgCBEEHakEDdiICIAAoAgwiBUkEQAJAIAAoAgAh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aiIGQRBLDQALIAMgCWohAyAIayECIQEMAgsgAyABKAIAIgU6AAAgAyABLAABOgABIAJBbGpBcHEiCEESaiIJIAFqIAJBbmogA0ECaiEEIAJBfmohBiABQQJqIQIgBSEBA0AgBCACKAICIgVBEHQgAUEQdnI2AgAgBCACKAIGIgFBEHQgBUEQdnI2AgQgBCACKAIKIgVBEHQgAUEQdnI2AgggBCACKAIOIgFBEHQgBUEQdnI2AgwgAkEQaiECIARBEGohBCAGQXBqIgZBEUsNAAsgAyAJaiEDIAhrIQIhAQwBCyADIAEoAgAiBToAACACQWxqQXBxIghBEWoiCSABaiACQW9qIANBAWohBCACQX9qIQYgAUEBaiECIAUhAQNAIAQgAigCAyIFQRh0IAFBCHZyNgIAIAQgAigCByIBQRh0IAVBCHZyNgIEIAQgAigCCyIFQRh0IAFBCHZyNgIIIAQgAigCDyIBQRh0IAVBCHZyNgIMIAJBEGohAiAEQRBqIQQgBkFwaiIGQRJLDQALIAMgCWohAyAIayECIQELCyACQRBxBEAgAyABLAAAOgAAIAMgASwAAToAASADIAEsAAI6AAIgAyABLAADOgADIAMgASwABDoABCADIAEsAAU6AAUgAyABLAAGOgAGIAMgASwABzoAByADIAEsAAg6AAggAyABLAAJOgAJIAMgASwACjoACiADIAEsAAs6AAsgAyABLAAMOgAMIAMgASwADToADSADIAEsAA46AA4gAyABLAAPOgAPIANBEGohAyABQRBqIQELIAJBCHEEQCADIAEsAAA6AAAgAyABLAABOgABIAMgASwAAjoAAiADIAEsAAM6AAMgAyABLAAEOgAEIAMgASwABToABSADIAEsAAY6AAYgAyABLAAHOgAHIANBCGohAyABQQhqIQELIAJBBHEEQCADIAEsAAA6AAAgAyABLAABOgABIAMgASwAAjoAAiADIAEsAAM6AAMgA0EEaiEDIAFBBGohAQsgAkECcQRAIAMgASwAADoAACADIAEsAAE6AAEgA0ECaiEDIAFBAmohAQsgAkEBcUUEQCAADwsgAyABLAAAOgAAIAALwAMBBn8gACABRgRAIAAPCyABIAJqIABLIAAgAmoiBSABS3FFBEAgACABIAIQOhogAA8LIAEgACIDc0EDcUUhBCADIAFJBH8gBARAIANBA3EEQAJAA0AgAgRAIAJBf2ohAiABQQFqIQQgAyABLAAAOgAAIANBAWoiA0EDcQRAIAQhAQwCBSAEIQEMAwsACwsgAA8LCyACQQNLBEAgAkF8aiIGQXxxIgdBBGoiCCADaiACIQQgASECA0AgAyACKAIANgIAIANBBGohAyACQQRqIQIgBEF8aiIEQQNLDQALIQMgBiAHayECIAEgCGohAQsLIAJFBEAgAA8LA0AgAUEBaiEEIANBAWohBSADIAEsAAA6AAAgAkF/aiICBEAgBSEDIAQhAQwBCwsgAAUgBARAIAVBA3EEQAJAA0AgAgRAIAMgAkF/aiICaiIAIAEgAmosAAA6AAAgAEEDcUUNAgwBCwsgAw8LCyACQQNLBEAgAiEAA0AgAyAAQXxqIgBqIAAgAWooAgA2AgAgAEEDSw0ACyACQQNxIQILCyACRQRAIAMPCwNAIAMgAkF/aiICaiABIAJqLAAAOgAAIAINAAsgAwsLgwMCA38BfgJAIAJFDQAgACACQX9qaiABQf8BcSIDOgAAIAAgAzoAACACQQNJDQAgACACQX5qaiADOgAAIAAgAzoAASAAIAJBfWpqIAM6AAAgACADOgACIAJBB0kNACAAIAJBfGpqIAM6AAAgACADOgADIAJBCUkNACAAQQAgAGtBA3EiBWoiBCABQf8BcUGBgoQIbCIDNgIAIAQgAiAFa0F8cSICaiIBQXxqIAM2AgAgAkEJSQ0AIAQgAzYCBCAEIAM2AgggAUF0aiADNgIAIAFBeGogAzYCACACQRlJDQAgBCADNgIMIAQgAzYCECAEIAM2AhQgBCADNgIYIAFBZGogAzYCACABQWhqIAM2AgAgAUFsaiADNgIAIAFBcGogAzYCACACIARBBHFBGHIiAmsiAUEfTQ0AIAOtIgYgBkIghoQhBiACIARqIQIDQCACIAY3AwAgAiAGNwMIIAIgBjcDECACIAY3AxggAkEgaiECIAFBYGoiAUEfSw0ACyAADwsgAAsVACMAQbDOAGokASMBQYCAwAJqJAILC6tNAQAjAAukTQAAAADZzr9BAADAQQAAyEGPwu9BAADwQQAASEKPwm9CAABwQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQgQCQIDChEYIBkSCwQFDBMaISgwKSIbFA0GBw4VHCMqMTg5MiskHRYPFx4lLDM6OzQtJh8nLjU8PTYvNz4/CBATFhobHSIQEBYYGx0iJRMWGhsdIiImFhYaGx0iJSgWGhsdICMoMBobHSAjKDA6GhsdIiYuOEUbHSMmLjhFUwMAAAAGAAAAAAAAAAkAAAAMAAAAAAAAAAAAAAAAAAAAAQAAAA8AAAASAAAAAAAAABUAAAAYAAAAAAAAABsAAAAeAAAAAAAAACEAAAAkAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAgAAACcAAAAqAAAAAAAAAC0AAAAwAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAABAAAADMAAAA2AAAAAAAAADkAAAA8AAAAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAABgAAAD8AAABCAAAAAAAAAEUAAABIAAAAAAAAAEsAAABOAAAAAAAAAFEAAABUAAAAAAAAAP////9XAAAAAAAAAP////9aAAAAAAAAAF0AAABgAAAAAAAAAGMAAABmAAAAAAAAAGkAAABsAAAAAAAAAG8AAAByAAAAAAAAAAAAAAAAAAAACQAAAAAAAAAAAAAACAAAAHUAAAB4AAAAAAAAAHsAAAB+AAAAAAAAAIEAAACEAAAAAAAAAIcAAACKAAAAAAAAAAAAAAAAAAAADwAAAAAAAAAAAAAADgAAAAAAAAAAAAAADQAAAAAAAAAAAAAADAAAAAAAAAAAAAAACwAAAAAAAAAAAAAACgAAAI0AAAD/////AAAAAP////+QAAAAAAAAAJMAAACWAAAAAAAAAJkAAACcAAAAAAAAAJ8AAACiAAAAAAAAAKUAAACoAAAAAAAAAKsAAACuAAAAAAAAALEAAAC0AAAAAAAAALcAAAD/////AAAAAP////+6AAAAAAAAAL0AAADAAAAAAAAAAMMAAADGAAAAAAAAAMkAAADMAAAAAAAAAM8AAADSAAAAAAAAANUAAADYAAAAAAAAANsAAADeAAAAAAAAAAAAAAAAAAAAFQAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAEwAAAAAAAAAAAAAAEgAAAAAAAAAAAAAAEQAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAIwAAAAAAAAAAAAAAIgAAAAAAAAAAAAAAIQAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAHwAAAAAAAAAAAAAAHgAAAAAAAAAAAAAAHQAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAGwAAAAAAAAAAAAAAGgAAAAAAAAAAAAAAGQAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAFwAAAAAAAAAAAAAAFgAAAAAAAAAAAAAAAAAAAAMAAAAGAAAAAAAAAP////8JAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAEQAAAAMAAAAGAAAAAAAAAAkAAAAMAAAAAAAAAAAAAAAAAAAACgAAAA8AAAASAAAAAAAAAAAAAAAAAAAAAgAAABUAAAAYAAAAAAAAAAAAAAAAAAAACAAAABsAAAAeAAAAAAAAACEAAAAkAAAAAAAAAP////8nAAAAAAAAAAAAAAAAAAAAEgAAAAAAAAAAAAAAGgAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAEQAAAAAAAAAAAAAABgAAAAMAAAAAAAAACQAAABIAAAAAAAAADAAAAA8AAAAAAAAAGAAAACEAAAAAAAAAJAAAACcAAAAAAAAAGwAAABUAAAAAAAAAHgAAACoAAAAAAAAAPAAAADkAAAAAAAAANgAAADAAAAAAAAAARQAAADMAAAAAAAAAUQAAAEsAAAAAAAAAPwAAAFQAAAAAAAAALQAAAEIAAAAAAAAASAAAAE4AAAAAAAAAAAAAAAAAAAA8AAAAaQAAAHgAAAAAAAAAhAAAAJAAAAAAAAAAcgAAAGwAAAAAAAAAfgAAAI0AAAAAAAAAVwAAAF0AAAAAAAAAdQAAAGAAAAAAAAAAAAAAAAAAAAAgAAAAhwAAAIoAAAAAAAAAYwAAAHsAAAAAAAAAgQAAAGYAAAAAAAAAAAAAAAAAAAAEAAAAWgAAAG8AAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAsAAAAlgAAAKgAAAAAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAA0AAAAAAAAAAAAAAA+AAAAtwAAALEAAAAAAAAAnAAAALQAAAAAAAAAAAAAAAAAAAABAAAApQAAAKIAAAAAAAAAAAAAAAAAAAA9AAAAAAAAAAAAAAA4AAAAqwAAAK4AAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAoAAAAmQAAALoAAAAAAAAAAAAAAAAAAAAwAAAAwAAAAL0AAAAAAAAAkwAAAJ8AAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAMAAAA8AAAAPkAAAAAAAAAAAAAAAAAAAA/AAAA5wAAAOEAAAAAAAAAwwAAANsAAAAAAAAA/AAAAMYAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAkAAAAAAAAAAAAAAADAAAAzwAAAAUBAAAAAAAA8wAAAO0AAAAAAAAAzAAAANUAAAAAAAAA0gAAAOoAAAAAAAAAyQAAAOQAAAAAAAAA2AAAAN4AAAAAAAAAAgEAAP8AAAAAAAAACAEAAPYAAAAAAAAA/////xoBAAAAAAAAHQEAACMBAAAAAAAAAAAAAAAAAAAhAAAAAAAAAAAAAAAJAAAAPgEAAEoBAAAAAAAAMgEAAFwBAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAKAAAAFwEAAAsBAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAASAAAAAAAAAAAAAAARAAAAAAAAAAAAAAAiAAAAUwEAAGUBAAAAAAAANQEAADgBAAAAAAAADgEAABQBAAAAAAAARwEAAEEBAAAAAAAAXwEAAGIBAAAAAAAALwEAACkBAAAAAAAAJgEAACABAAAAAAAALAEAABEBAAAAAAAAVgEAAFkBAAAAAAAAOwEAAEQBAAAAAAAAUAEAAE0BAAAAAAAAawEAAHcBAAAAAAAAAAAAAAAAAAApAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAVAAAAdAEAAG4BAAAAAAAAaAEAAHEBAAAAAAAAAAAAAAAAAAALAAAAAAAAAAAAAAATAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAjAAAAAAAAAAAAAAANAAAAAAAAAAAAAAAyAAAAAAAAAAAAAAAxAAAAAAAAAAAAAAA6AAAAAAAAAAAAAAAlAAAAAAAAAAAAAAAZAAAAAAAAAAAAAAAtAAAAAAAAAAAAAAA5AAAAAAAAAAAAAAAaAAAAAAAAAAAAAAAdAAAAAAAAAAAAAAAmAAAAAAAAAAAAAAA1AAAAAAAAAAAAAAAXAAAAAAAAAAAAAAArAAAAAAAAAAAAAAAuAAAAAAAAAAAAAAAqAAAAAAAAAAAAAAAWAAAAAAAAAAAAAAA2AAAAAAAAAAAAAAAzAAAAAAAAAAAAAAAPAAAAAAAAAAAAAAAeAAAAAAAAAAAAAAAnAAAAAAAAAAAAAAAvAAAAAAAAAAAAAAA3AAAAAAAAAAAAAAAbAAAAAAAAAAAAAAA7AAAAAAAAAAAAAAAfAAAAAAAAAAAAAAADAAAABgAAAAAAAAAMAAAACQAAAAAAAAAAAAAAAAAAAAAAAAASAAAADwAAAAAAAAAYAAAAFQAAAAAAAAAAAAAAAAAAAP////8AAAAAAAAAAAEAAAAbAAAAHgAAAAAAAAAkAAAAIQAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAP7///8qAAAALQAAAAAAAAAwAAAAJwAAAAAAAAA8AAAANgAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAP3///8zAAAAOQAAAAAAAAD/////RQAAAAAAAABRAAAASwAAAAAAAABOAAAAPwAAAAAAAABIAAAAQgAAAAAAAABgAAAAVAAAAAAAAABXAAAAXQAAAAAAAAD/////YwAAAAAAAABsAAAAaQAAAAAAAAAAAAAAAAAAAPz///9aAAAAZgAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAPn///8AAAAAAAAAAAUAAABvAAAAewAAAAAAAAAAAAAAAAAAAPv///8AAAAAAAAAAAcAAAByAAAAeAAAAAAAAAB+AAAAdQAAAAAAAAAAAAAAAAAAAPr///8AAAAAAAAAAAYAAACZAAAAogAAAAAAAACWAAAAkwAAAAAAAACHAAAAigAAAAAAAACcAAAAjQAAAAAAAACBAAAAnwAAAAAAAACEAAAAkAAAAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAAAAkAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAPj///+rAAAAxgAAAAAAAAAAAAAAAAAAAPf///+0AAAAwAAAAAAAAACoAAAAtwAAAAAAAAClAAAAugAAAAAAAACuAAAAvQAAAAAAAAAAAAAAAAAAAPb///+xAAAAwwAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAABAAAAAAAAAAAAAAAA0AAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAsAAAAAAAAAAAAAAA8AAAAAAAAAAAAAAPD///8AAAAAAAAAAPT///8AAAAAAAAAAPL///8AAAAAAAAAAPH///8AAAAAAAAAAPX///8AAAAAAAAAAPP///8AAAAAAAAAAAAAAAAGAAAAAwAAAAAAAAASAAAADwAAAAAAAAAJAAAADAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAIAAAAbAAAAGAAAAAAAAAAVAAAAHgAAAAAAAAAAAAAAAAAAAAAAAAAkAAAAIQAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAMAAAAnAAAAKgAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAYAAAAwAAAALQAAAAAAAAAzAAAA/////wAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAYAAAADAAAAAAAAAAwAAAAJAAAAAAAAABIAAAAPAAAAAAAAABgAAAAVAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAB4AAAAbAAAAAAAAAAAAAAAAAAAAAwAAACQAAAAhAAAAAAAAAAAAAAAAAAAABAAAACoAAAAnAAAAAAAAAAAAAAAAAAAABQAAADAAAAAtAAAAAAAAAAAAAAAAAAAABgAAADMAAAD/////AAAAAAAAAAAAAAAABwAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAwAAAAYAAAAAAAAADAAAAAkAAAAAAAAAAAAAAAAAAAABAAAAFQAAABgAAAAAAAAAEgAAAA8AAAAAAAAAJwAAABsAAAAAAAAAIQAAAB4AAAAAAAAAKgAAACQAAAAAAAAAAAAAAAAAAAABAQAAPAAAAEIAAAAAAAAANgAAAD8AAAAAAAAAMAAAADkAAAAAAAAAAAAAAAAAAAABAgAAMwAAAC0AAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAADAAAAUQAAAEsAAAAAAAAAVwAAAF0AAAAAAAAASAAAAE4AAAAAAAAAYAAAAFoAAAAAAAAAAAAAAAAAAAABBAAARQAAAFQAAAAAAAAAAAAAAAAAAAABAwAAAAAAAAAAAAACAQAAAAAAAAAAAAABBwAAAAAAAAAAAAD//wAAAAAAAAAAAAABBgAAbwAAAGwAAAAAAAAAAAAAAAAAAAABBQAAaQAAAGYAAAAAAAAAdQAAAHIAAAAAAAAAYwAAAH4AAAAAAAAAeAAAAHsAAAAAAAAAnAAAAJYAAAAAAAAAogAAAJ8AAAAAAAAAkAAAAJMAAAAAAAAAgQAAAIcAAAAAAAAAigAAAIQAAAAAAAAAAAAAAAAAAAABCAAAAAAAAAAAAAAEAAAAAAAAAAAAAAACAgAAAAAAAAAAAAABCQAAmQAAAI0AAAAAAAAApQAAAKsAAAAAAAAAtAAAAKgAAAAAAAAAsQAAAK4AAAAAAAAAtwAAALoAAAAAAAAAAAAAAAAAAAABCgAAAAAAAAAAAAABDQAAAAAAAAAAAAAGAAAAAAAAAAAAAAADAQAAAAAAAAAAAAAFAAAAAAAAAAAAAAACAwAAAAAAAAAAAAABCwAAAAAAAAAAAAABDAAA5AAAAOEAAAAAAAAAyQAAANIAAAAAAAAA2wAAANUAAAAAAAAA6gAAAN4AAAAAAAAA2AAAAOcAAAAAAAAAzwAAAMAAAAAAAAAAzAAAAL0AAAAAAAAAxgAAAMMAAAAAAAAA8wAAAAUBAAAAAAAAEQEAAPAAAAAAAAAA9gAAAO0AAAAAAAAA+QAAAAIBAAAAAAAAFwEAABQBAAAAAAAA/AAAAP8AAAAAAAAADgEAABoBAAAAAAAACAEAAAsBAAAAAAAAAAAAAAAAAAADAgAAAAAAAAAAAAAEAQAAAAAAAAAAAAAHAAAAAAAAAAAAAAACBAAAAAAAAAAAAAACBQAAAAAAAAAAAAABEAAAAAAAAAAAAAABDwAAAAAAAAAAAAABDgAAOwEAAEEBAAAAAAAATQEAAFYBAAAAAAAAOAEAACMBAAAAAAAAdwEAAGUBAAAAAAAAIAEAACYBAAAAAAAA/////3EBAAAAAAAAHQEAAC8BAAAAAAAAPgEAAGsBAAAAAAAAKQEAADIBAAAAAAAAUwEAADUBAAAAAAAAUAEAAFwBAAAAAAAASgEAACwBAAAAAAAAdAEAAFkBAAAAAAAAXwEAAG4BAAAAAAAARwEAAGIBAAAAAAAAaAEAAEQBAAAAAAAAfQEAAJgBAAAAAAAAoQEAAKQBAAAAAAAAhgEAAHoBAAAAAAAAswEAALYBAAAAAAAAgAEAAIMBAAAAAAAAAAAAAAAAAAACCAAAjAEAAJIBAAAAAAAA0QEAAM4BAAAAAAAAAAAAAAAAAAAIAAAAmwEAAI8BAAAAAAAArQEAALABAAAAAAAAxQEAAJ4BAAAAAAAAqgEAAKcBAAAAAAAAAAAAAAAAAAAKAAAAAAAAAAAAAAAJAAAAAAAAAAAAAAALAAAAAAAAAAAAAAABFQAAAAAAAAAAAAACBgAAAAAAAAAAAAADAwAAAAAAAAAAAAABFAAAAAAAAAAAAAACBwAAAAAAAAAAAAABEQAAAAAAAAAAAAABEgAAAAAAAAAAAAABEwAAvAEAAMgBAAAAAAAAAAAAAAAAAAADBAAAywEAAMIBAAAAAAAAAAAAAAAAAAAFAQAAiQEAAJUBAAAAAAAAAAAAAAAAAAAEAgAAvwEAALkBAAAAAAAABAIAAAcCAAAAAAAA5gEAANoBAAAAAAAA/gEAAOMBAAAAAAAA+AEAAPIBAAAAAAAA1wEAABkCAAAAAAAA+wEAAPUBAAAAAAAACgIAAAECAAAAAAAAFgIAABMCAAAAAAAA1AEAAN0BAAAAAAAA7AEAAO8BAAAAAAAAJQIAACICAAAAAAAADQIAABACAAAAAAAAAAAAAAAAAAAHAQAAAAAAAAAAAAACCgAAAAAAAAAAAAACCQAAAAAAAAAAAAABFgAAAAAAAAAAAAABFwAAAAAAAAAAAAABGQAAAAAAAAAAAAABGAAAAAAAAAAAAAADBQAAAAAAAAAAAAAEAwAAAAAAAAAAAAANAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAPAAAAAAAAAAAAAAAFAgAAAAAAAAAAAAABGgAAAAAAAAAAAAAGAQAAHAIAAB8CAAAAAAAA4AEAAOkBAAAAAAAATAIAAFUCAAAAAAAAAAAAAAAAAAAbAAAAYQIAACsCAAAAAAAAXgIAAFsCAAAAAAAAAAAAAAAAAAATAAAAAAAAAAAAAAAWAAAATwIAAG0CAAAAAAAAAAAAAAAAAAASAAAAPQIAAEACAAAAAAAANAIAADoCAAAAAAAAAAAAAAAAAAAUAAAAKAIAAEYCAAAAAAAAAAAAAAAAAAAVAAAALgIAAEMCAAAAAAAAAAAAAAAAAAAXAAAAZAIAAFICAAAAAAAAAAAAAAAAAAAZAAAAAAAAAAAAAAAYAAAAWAIAAGcCAAAAAAAAAAAAAAAAAAAfAAAAAAAAAAAAAAAeAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAdAAAAAAAAAAAAAAAaAAAAAAAAAAAAAAARAAAAAAAAAAAAAAAQAAAANwIAAGoCAAAAAAAAMQIAAEkCAAAAAAAAjgIAAHkCAAAAAAAAAAAAAAAAAAAlAAAAhQIAAIgCAAAAAAAAAAAAAAAAAAAkAAAAdgIAAHwCAAAAAAAAAAAAAAAAAAAiAAAAfwIAAHMCAAAAAAAAlwIAAJoCAAAAAAAAkQIAAHACAAAAAAAAiwIAAIICAAAAAAAAnQIAAJQCAAAAAAAAAAAAAAAAAAAjAAAAAAAAAAAAAAALAQAAAAAAAAAAAAAoAAAAAAAAAAAAAAAMAQAAAAAAAAAAAAAKAQAAAAAAAAAAAAAgAAAAAAAAAAAAAAAIAQAAAAAAAAAAAAAJAQAAAAAAAAAAAAAmAAAAAAAAAAAAAAANAQAAAAAAAAAAAAAOAQAAAAAAAAAAAAAhAAAAAAAAAAAAAAAnAAAAAAAAAAAAAAABHwAAAAAAAAAAAAABGwAAAAAAAAAAAAABHgAAAAAAAAAAAAACEAAAAAAAAAAAAAABHQAAAAAAAAAAAAABHAAAAAAAAAAAAAAPAQAAAAAAAAAAAAASAQAAAAAAAAAAAAARAQAAAAAAAAAAAAAQAQAAAAAAAAAAAAADBgAAAAAAAAAAAAACCwAAAAAAAAAAAAACDgAAAAAAAAAAAAACDQAAAAAAAAAAAAACDAAAAAAAAAAAAAACDwAAICwqJiAZEQksPjo0LCMYDCo6NzEqIRcMJjQxLCYeFAogLComIBkRCRkjIR4ZFA4HERgXFBEOCQUJDAwKCQcFAgAAAAAAAAC/AAAAvwAAAL8AAAC/AAAAvwAAAL8AAIC/AACAvwAAgL8AAIC/AADAvwAAwL8AAADAAAAAwAAAIMAAACDAAABAwAAAYMAAAGDAAACAwAAAkMAAAKDAAACwwAAA0MAAAODAAAAAwQAACMEAABjBAAAowQAAQMEAAFDBAABowQAAeMEAAIzBAACYwQAApMEAALTBAADEwQAA1MEAAOjBAAD8wQAACMIAABLCAAAewgAAKsIAADbCAABCwgAAUMIAAF7CAABqwgAAesIAAITCAACLwgAAk8IAAJrCAAChwgAAqcIAALDCAAC3wgAAvsIAAMTCAADKwgAA0MIAANVCAADaQgAA3kIAAOFCAADjQgAA5EIAAORCAADjQgAA4EIAAN1CAADXQgAA0EIAAMhCAAC9QgAAsUIAAKNCAACSQgAAfkIAAFRCAAAmQgAA5EEAAGhBAACAvwAAkMEAABDCAABewgAAmcIAAMXCAAD0wgAAE8MAgC3DAIBIwwCAZcMAwIHDAECRwwBAocMAwLHDAMDCwwAA1MMAwOXDAMD3wwAABcQAIA7EAEAXxABgIMQAgCnEAIAyxABAO8QA4EPEAEBMxABAVMQA4FvEACBjxADAacQA4G/EAEB1xAAgesQAAH7EAJCAxACwgcQAUILEAHCCxAAAgsQA8IDEAKB+RAAAekQAAHREAKBsRADAY0QAYFlEAIBNRADgP0QAwDBEAAAgRABgDUQAgPJDAIDGQwBAl0MAAElDAAC5QgAAtMEAABDDAECIwwCAy8MA4AjEAIAtxACAU8QAwHrEAKCRxABwpsQAwLvEAHDRxACQ58QA8P3EAEgKxQCgFcUACCHFAGgsxQC4N8UA6ELFAOhNxQC4WMUAOGPFAGhtxQAwd8UARIDFAKyExQDMiMUAmIzFAAyQxQAgk8UAxJXFAPyXxQC4mcUA8JrFAJybxQC4m8UAPJvFAByaxQBYmMUA4JXFALSSxQDMjsUAIIrFALCExQDgfMUAwG7FAPBexQBwTUUAODpFAEAlRQCIDkUAAOxEAHC3RACgfkQAQAdEAAAMQgCA+cMAoITEAEDOxACoDcUA0DXFAJBfxQBwhcUA3JvFAPyyxQDQysUAUOPFAGz8xQAOC8YALBjGAIolxgAiM8YA7EDGAOROxgACXcYAQGvGAJZ5xgD/g8YAOIvGAHGSxgComcYA2KDGAP6nxgAVr8YAGbbGAAa9xgDZw8YAjcrGAB7RxgCK18YAyt3GAN3jxgC+6cYAae/GANz0xgAT+sYACv/GAN8Bx4AWBMcAKgbHgBcIxwDfCccAfgvHgPQMx4BBDseAYw/HAFoQx4AkEccAwxHHADQSxwB4EscAjxJHAHgSRwA0EkcAwxFHgCQRRwBaEEeAYw9HgEEOR4D0DEcAfgtHAN8JR4AXCEcAKgZHgBYERwDfAUcACv9GABP6RgDc9EYAae9GAL7pRgDd40YAyt1GAIrXRgAe0UYAjcpGANnDRgAGvUYAGbZGABWvRgD+p0YA2KBGAKiZRgBxkkYAOItGAP+DRgCWeUYAQGtGAAJdRgDkTkYA7EBGACIzRgCKJUYALBhGAA4LRgBs/EUAUONFANDKRQD8skUA3JtFAHCFRQCQX0UA0DVFAKgNRQBAzkQAoIREAID5QwAADMIAQAfEAKB+xABwt8QAAOzEAIgOxQBAJcUAODrFAHBNRQDwXkUAwG5FAOB8RQCwhEUAIIpFAMyORQC0kkUA4JVFAFiYRQAcmkUAPJtFALibRQCcm0UA8JpFALiZRQD8l0UAxJVFACCTRQAMkEUAmIxFAMyIRQCshEUARIBFADB3RQBobUUAOGNFALhYRQDoTUUA6EJFALg3RQBoLEUACCFFAKAVRQBICkUA8P1EAJDnRABw0UQAwLtEAHCmRACgkUQAwHpEAIBTRACALUQA4AhEAIDLQwBAiEMAABBDAAC0QQAAucIAAEnDAECXwwCAxsMAgPLDAGANxAAAIMQAwDDEAOA/xACATcQAYFnEAMBjxACgbMQAAHTEAAB6xACgfkQA8IBEAACCRABwgkQAUIJEALCBRACQgEQAAH5EACB6RABAdUQA4G9EAMBpRAAgY0QA4FtEAEBURABATEQA4ENEAEA7RACAMkQAgClEAGAgRABAF0QAIA5EAAAFRADA90MAwOVDAADUQwDAwkMAwLFDAEChQwBAkUMAwIFDAIBlQwCASEMAgC1DAAATQwAA9EIAAMVCAACZQgAAXkIAABBCAACQQQAAgD8AAGjBAADkwQAAJsIAAFTCAAB+wgAAksIAAKPCAACxwgAAvcIAAMjCAADQwgAA18IAAN3CAADgwgAA48IAAOTCAADkwgAA48IAAOHCAADewgAA2sIAANVCAADQQgAAykIAAMRCAAC+QgAAt0IAALBCAACpQgAAoUIAAJpCAACTQgAAi0IAAIRCAAB6QgAAakIAAF5CAABQQgAAQkIAADZCAAAqQgAAHkIAABJCAAAIQgAA/EEAAOhBAADUQQAAxEEAALRBAACkQQAAmEEAAIxBAAB4QQAAaEEAAFBBAABAQQAAKEEAABhBAAAIQQAAAEEAAOBAAADQQAAAsEAAAKBAAACQQAAAgEAAAGBAAABgQAAAQEAAACBAAAAgQAAAAEAAAABAAADAPwAAwD8AAIA/AACAPwAAgD8AAIA/AAAAPwAAAD8AAAA/AAAAPwAAAD8AAAA/IAAwADgAQABQAGAAcACAAKAAwADgAAABQAGAAQgAEAAYACAAKAAwADgAQABQAGAAcACAAJAAoAAAAAAAAAAAAESsgLsAfQAAIlbAXYA+AAAAAAEBAQICAgICAgICAgAAAAAAAAAAAQEBAgICAgIAAERENDQ0NDQ0NDQ0NAAAAAAAAAAAAAAAAAAAAAAAAAAAQ0NDQkJCQkJCQkIxMTExMTExMTExMTEgICAgICAgAABFRUVFNDQ0NDQ0NCQkJCQkJCQkJCQkJCQkJCQkJCQAAAABAhEAAAAAAAAAAAAAAAAAAQIDBAUGEQAAAAAAAAAAAAECAwQFBgcICQoLDA0OEQABAwUGBwgJCgsMDQ4PEBEAAQIEBQYHCAkKCwwNDg8RAAECAwQFBgcICQoLDA0ODwMAAQUFAAEHBwAAAwkAAQoPAAAEHwAABT8AAAZ/AAAH/wAACP8BAAn/AwAK/wcAC/8PAAz/HwAN/z8ADv9/AA///wAQAAAAAAAAAAAAAAAAAAAAAupflgEwikIBCAgMW1tbXltec2l6ZSA+IDAAL2hvbWUvZG9taW5pYy9wcm9qZWN0cy9lbXNkay9mYXN0Y29tcC9lbXNjcmlwdGVuL3N5c3RlbS9saWIvZW1tYWxsb2MuY3BwAGdldEZyZWVMaXN0SW5kZXgATUlOX0ZSRUVMSVNUX0lOREVYIDw9IGluZGV4ICYmIGluZGV4IDwgTUFYX0ZSRUVMSVNUX0lOREVYAGdldEFmdGVyKHJlZ2lvbikgPD0gc2JyaygwKQBlbW1hbGxvY19tYWxsb2MAcmVnaW9uLT5nZXRVc2VkKCkAZ2V0UGF5bG9hZAAoY2hhciopZXh0cmFQdHIgPT0gKGNoYXIqKXB0ciArIHNicmtTaXplAGFsbG9jYXRlUmVnaW9uACFsYXN0UmVnaW9uACFmaXJzdFJlZ2lvbgBmaXJzdFJlZ2lvbgBwdHIgPT0gZ2V0QWZ0ZXIobGFzdFJlZ2lvbikAZXh0ZW5kTGFzdFJlZ2lvbgBhZGRUb0ZyZWVMaXN0AGdldEJpZ0Vub3VnaEZyZWVMaXN0SW5kZXgAcGF5bG9hZFNpemUgPj0gc2l6ZQBwb3NzaWJseVNwbGl0UmVtYWluZGVyAGV4dHJhID49IE1JTl9SRUdJT05fU0laRQB0b3RhbFNwbGl0U2l6ZSA+PSBNSU5fUkVHSU9OX1NJWkUAbWVyZ2VJbnRvRXhpc3RpbmdGcmVlUmVnaW9uAHJlZ2lvbiA9PSBsYXN0UmVnaW9uAGVtbWFsbG9jX3JlYWxsb2M=";
	// src/lib/webaudio.js
	var UNLOCK_EVENTS = [
		"pointerdown",
		"pointerup",
		"keydown",
		"touchend"
	];
	var WebAudioOut = class WebAudioOut {
		constructor() {
			this.context = WebAudioOut.CachedContext = WebAudioOut.CachedContext || new (window.AudioContext || window.webkitAudioContext)();
			this.gain = this.context.createGain();
			this.destination = this.gain;
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
			Object.defineProperty(this, "enqueuedTime", { get: this.getEnqueuedTime });
			if (!this.unlocked) this.listenForGesture();
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
			if (!this.enabled || this.destroyed) return;
			if (!this.unlocked && !WebAudioOut.NeedsUnlocking() && WebAudioOut.IsRunning(this.context)) this.onUnlocked();
			if (!this.isPlayable()) {
				this.listenForGesture();
				const ts = Now();
				if (this.wallclockStartTime < ts) this.wallclockStartTime = ts;
				this.wallclockStartTime += left.length / sampleRate;
				this.skippedAudio = true;
				return;
			}
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
				if (index !== -1) this.sources.splice(index, 1);
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
			this.gain.gain.value = 0;
			this.stopSources();
			this.resetEnqueuedTime();
		}
		getEnqueuedTime() {
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
				} catch (e) {}
				try {
					source.disconnect();
				} catch (e) {}
			});
		}
		listenForGesture() {
			if (this.gestureListener || this.isPlayable() || this.destroyed || WebAudioOut.NeedsUnlocking() || typeof document === "undefined") return;
			this.gestureListener = () => this.unlock();
			UNLOCK_EVENTS.forEach((type) => {
				document.addEventListener(type, this.gestureListener, true);
			});
		}
		removeGestureListener() {
			if (!this.gestureListener) return;
			UNLOCK_EVENTS.forEach((type) => {
				document.removeEventListener(type, this.gestureListener, true);
			});
			this.gestureListener = null;
		}
		unlock(callback) {
			if (this.isPlayable() || this.destroyed || this.context.state === "closed") {
				if (callback) callback();
				return;
			}
			this.unlockCallback = callback || this.unlockCallback;
			const buffer = this.context.createBuffer(1, 1, 22050);
			const source = this.context.createBufferSource();
			source.buffer = buffer;
			source.connect(this.destination);
			if (source.start) source.start(0);
			else source.noteOn(0);
			let resumed = null;
			try {
				resumed = this.context.resume && this.context.resume();
			} catch (e) {}
			if (resumed && resumed.then) {
				resumed.then(() => this.checkIfUnlocked(source, 0), () => this.checkIfUnlocked(source, 0));
				return;
			}
			setTimeout(this.checkIfUnlocked.bind(this, source, 0), 0);
		}
		checkIfUnlocked(source, attempt) {
			if (this.destroyed || this.context.state === "closed") {
				this.unlockCallback = null;
				return;
			}
			const legacyUnlocked = source.playbackState !== void 0 && (source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE);
			if (this.context.state ? this.context.state === "running" : legacyUnlocked) this.onUnlocked();
			else if (attempt < 10) setTimeout(this.checkIfUnlocked.bind(this, source, attempt + 1), 100);
		}
		onUnlocked() {
			if (this.destroyed) return;
			this.removeGestureListener();
			const firstUnlock = !this.unlocked;
			this.unlocked = true;
			const callbacks = [this.unlockCallback, firstUnlock ? this.onUnlock : null];
			this.unlockCallback = null;
			callbacks.forEach((callback) => {
				if (callback) callback();
			});
		}
		static NeedsUnlocking() {
			return /iPhone|iPad|iPod/i.test(navigator.userAgent);
		}
		static IsRunning(context) {
			return !context.state || context.state === "running";
		}
		static IsSupported() {
			return window.AudioContext || window.webkitAudioContext;
		}
	};
	WebAudioOut.CachedContext = null;
	// src/lib/webgl.js
	var WebGLRenderer = class WebGLRenderer {
		constructor(options) {
			if (options.canvas) {
				this.canvas = options.canvas;
				this.ownsCanvasElement = false;
			} else {
				this.canvas = document.createElement("canvas");
				this.ownsCanvasElement = true;
			}
			this.width = this.canvas.width;
			this.height = this.canvas.height;
			this.enabled = true;
			this.hasTextureData = {};
			const contextCreateOptions = {
				preserveDrawingBuffer: !!options.preserveDrawingBuffer,
				alpha: false,
				depth: false,
				stencil: false,
				antialias: false,
				premultipliedAlpha: false
			};
			this.gl = this.canvas.getContext("webgl", contextCreateOptions) || this.canvas.getContext("experimental-webgl", contextCreateOptions);
			if (!this.gl) throw new Error("Failed to get WebGL Context");
			this.handleContextLostBound = this.handleContextLost.bind(this);
			this.handleContextRestoredBound = this.handleContextRestored.bind(this);
			this.canvas.addEventListener("webglcontextlost", this.handleContextLostBound, false);
			this.canvas.addEventListener("webglcontextrestored", this.handleContextRestoredBound, false);
			this.initGL();
		}
		initGL() {
			this.hasTextureData = {};
			const { gl } = this;
			let vertexAttr = null;
			gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
			this.vertexBuffer = gl.createBuffer();
			const vertexCoords = new Float32Array([
				0,
				0,
				0,
				1,
				1,
				0,
				1,
				1
			]);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, vertexCoords, gl.STATIC_DRAW);
			this.program = this.createProgram(WebGLRenderer.SHADER.VERTEX_IDENTITY, WebGLRenderer.SHADER.FRAGMENT_YCRCB_TO_RGBA);
			vertexAttr = gl.getAttribLocation(this.program, "vertex");
			gl.enableVertexAttribArray(vertexAttr);
			gl.vertexAttribPointer(vertexAttr, 2, gl.FLOAT, false, 0, 0);
			this.textureY = this.createTexture(0, "textureY");
			this.textureCb = this.createTexture(1, "textureCb");
			this.textureCr = this.createTexture(2, "textureCr");
			this.loadingProgram = this.createProgram(WebGLRenderer.SHADER.VERTEX_IDENTITY, WebGLRenderer.SHADER.FRAGMENT_LOADING);
			vertexAttr = gl.getAttribLocation(this.loadingProgram, "vertex");
			gl.enableVertexAttribArray(vertexAttr);
			gl.vertexAttribPointer(vertexAttr, 2, gl.FLOAT, false, 0, 0);
			this.shouldCreateUnclampedViews = !this.allowsClampedTextureData();
		}
		handleContextLost(ev) {
			ev.preventDefault();
			this.contextLost = true;
		}
		handleContextRestored() {
			this.initGL();
		}
		destroy() {
			const { gl } = this;
			this.deleteTexture(gl.TEXTURE0, this.textureY);
			this.deleteTexture(gl.TEXTURE1, this.textureCb);
			this.deleteTexture(gl.TEXTURE2, this.textureCr);
			gl.useProgram(null);
			gl.deleteProgram(this.program);
			gl.deleteProgram(this.loadingProgram);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
			gl.deleteBuffer(this.vertexBuffer);
			this.canvas.removeEventListener("webglcontextlost", this.handleContextLostBound, false);
			this.canvas.removeEventListener("webglcontextrestored", this.handleContextRestoredBound, false);
			if (this.ownsCanvasElement) this.canvas.remove();
		}
		resize(width, height) {
			this.width = width | 0;
			this.height = height | 0;
			this.canvas.width = this.width;
			this.canvas.height = this.height;
			this.gl.useProgram(this.program);
			const codedWidth = this.width + 15 >> 4 << 4;
			this.gl.viewport(0, 0, codedWidth, this.height);
		}
		createTexture(index, name) {
			const { gl } = this;
			const texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.uniform1i(gl.getUniformLocation(this.program, name), index);
			return texture;
		}
		createProgram(vsh, fsh) {
			const { gl } = this;
			const program = gl.createProgram();
			gl.attachShader(program, this.compileShader(gl.VERTEX_SHADER, vsh));
			gl.attachShader(program, this.compileShader(gl.FRAGMENT_SHADER, fsh));
			gl.linkProgram(program);
			gl.useProgram(program);
			return program;
		}
		compileShader(type, source) {
			const { gl } = this;
			const shader = gl.createShader(type);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
			return shader;
		}
		allowsClampedTextureData() {
			const { gl } = this;
			const texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 1, 1, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, new Uint8ClampedArray([0]));
			return gl.getError() === 0;
		}
		renderProgress(progress) {
			const { gl } = this;
			gl.useProgram(this.loadingProgram);
			const loc = gl.getUniformLocation(this.loadingProgram, "progress");
			gl.uniform1f(loc, progress);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		}
		render(y, cb, cr, isClampedArray) {
			if (!this.enabled) return;
			const { gl } = this;
			const w = this.width + 15 >> 4 << 4;
			const h = this.height;
			const w2 = w >> 1;
			const h2 = h >> 1;
			if (isClampedArray && this.shouldCreateUnclampedViews) {
				y = new Uint8Array(y.buffer);
				cb = new Uint8Array(cb.buffer);
				cr = new Uint8Array(cr.buffer);
			}
			gl.useProgram(this.program);
			this.updateTexture(gl.TEXTURE0, this.textureY, w, h, y);
			this.updateTexture(gl.TEXTURE1, this.textureCb, w2, h2, cb);
			this.updateTexture(gl.TEXTURE2, this.textureCr, w2, h2, cr);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		}
		updateTexture(unit, texture, w, h, data) {
			const { gl } = this;
			gl.activeTexture(unit);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			if (this.hasTextureData[unit]) gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, w, h, gl.LUMINANCE, gl.UNSIGNED_BYTE, data);
			else {
				this.hasTextureData[unit] = true;
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, w, h, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, data);
			}
		}
		deleteTexture(unit, texture) {
			const { gl } = this;
			gl.activeTexture(unit);
			gl.bindTexture(gl.TEXTURE_2D, null);
			gl.deleteTexture(texture);
		}
		static IsSupported() {
			try {
				if (!window.WebGLRenderingContext) return false;
				const canvas = document.createElement("canvas");
				return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
			} catch (err) {
				return false;
			}
		}
	};
	WebGLRenderer.SHADER = {
		FRAGMENT_YCRCB_TO_RGBA: [
			"precision mediump float;",
			"uniform sampler2D textureY;",
			"uniform sampler2D textureCb;",
			"uniform sampler2D textureCr;",
			"varying vec2 texCoord;",
			"mat4 rec601 = mat4(",
			"1.16438,  0.00000,  1.59603, -0.87079,",
			"1.16438, -0.39176, -0.81297,  0.52959,",
			"1.16438,  2.01723,  0.00000, -1.08139,",
			"0, 0, 0, 1",
			");",
			"void main() {",
			"float y = texture2D(textureY, texCoord).r;",
			"float cb = texture2D(textureCb, texCoord).r;",
			"float cr = texture2D(textureCr, texCoord).r;",
			"gl_FragColor = vec4(y, cr, cb, 1.0) * rec601;",
			"}"
		].join("\n"),
		FRAGMENT_LOADING: [
			"precision mediump float;",
			"uniform float progress;",
			"varying vec2 texCoord;",
			"void main() {",
			"float c = ceil(progress-(1.0-texCoord.y));",
			"gl_FragColor = vec4(c,c,c,1);",
			"}"
		].join("\n"),
		VERTEX_IDENTITY: [
			"attribute vec2 vertex;",
			"varying vec2 texCoord;",
			"void main() {",
			"texCoord = vertex;",
			"gl_Position = vec4((vertex * 2.0 - 1.0) * vec2(1, -1), 0.0, 1.0);",
			"}"
		].join("\n")
	};
	// src/lib/websocket.js
	var WSSource = class {
		constructor(url, options) {
			this.url = url;
			this.options = options;
			this.socket = null;
			this.streaming = true;
			this.callbacks = {
				connect: [],
				data: []
			};
			this.destination = null;
			this.reconnectInterval = options.reconnectInterval !== void 0 ? options.reconnectInterval : 5;
			this.shouldAttemptReconnect = !!this.reconnectInterval;
			this.completed = false;
			this.established = false;
			this.progress = 0;
			this.reconnectTimeoutId = 0;
			this.onEstablishedCallback = options.onSourceEstablished;
			this.onCompletedCallback = options.onSourceCompleted;
			if (options.hookOnEstablished) this.hookOnEstablished = options.hookOnEstablished;
		}
		connect(destination) {
			this.destination = destination;
		}
		destroy() {
			clearTimeout(this.reconnectTimeoutId);
			this.shouldAttemptReconnect = false;
			if (!this.socket) return;
			this.socket.close();
		}
		start() {
			this.shouldAttemptReconnect = !!this.reconnectInterval;
			this.progress = 0;
			this.established = false;
			if (this.options.protocols) this.socket = new WebSocket(this.url, this.options.protocols);
			else this.socket = new WebSocket(this.url);
			this.socket.binaryType = "arraybuffer";
			this.socket.onmessage = this.onMessage.bind(this);
			this.socket.onopen = this.onOpen.bind(this);
			this.socket.onerror = this.onClose.bind(this);
			this.socket.onclose = this.onClose.bind(this);
		}
		resume() {}
		onOpen() {
			this.progress = 1;
		}
		onClose() {
			if (this.shouldAttemptReconnect) {
				clearTimeout(this.reconnectTimeoutId);
				this.reconnectTimeoutId = setTimeout(() => {
					this.start();
				}, this.reconnectInterval * 1e3);
			}
		}
		onMessage(ev) {
			const isFirstChunk = !this.established;
			this.established = true;
			if (isFirstChunk && this.hookOnEstablished) this.hookOnEstablished();
			if (isFirstChunk && this.onEstablishedCallback) this.onEstablishedCallback(this);
			if (this.destination) this.destination.write(ev.data);
		}
	};
	// src/lib/player.js
	var Player = class {
		/**
		* @param url
		* @param options
		* @param hooks (play: function, pause: function, stop: function) 插入UI回调
		* @constructor
		*/
		constructor(url, options = {}, hooks = {}) {
			if (!options.source && typeof url !== "string") throw new TypeError(`[JSMpeg] The url parameter must be a String, but got ${url === null ? "null" : typeof url}. Pass the URL of the stream (e.g. "wss://example.com/stream" or "video.ts") instead of an already created WebSocket instance.`);
			if (!options.source && url.trim().length === 0) throw new TypeError("[JSMpeg] The url parameter must be a non-empty string, e.g. \"video.ts\".");
			this.options = options;
			this.hooks = hooks;
			this.options.hookOnEstablished = () => {
				if (this.hooks.load) this.hooks.load();
			};
			if (options.source) {
				this.source = new options.source(url, this.options);
				options.streaming = !!this.source.streaming;
			} else if (/^wss?:\/\//.test(url)) {
				this.source = new WSSource(url, this.options);
				options.streaming = true;
			} else if (options.progressive) {
				this.source = new AjaxProgressiveSource(url, this.options);
				options.streaming = false;
			} else {
				this.source = new AjaxSource(url, this.options);
				options.streaming = false;
			}
			this.maxAudioLag = options.maxAudioLag || .25;
			this.loop = options.loop !== false;
			this.autoplay = !!options.autoplay || options.streaming;
			this.demuxer = new TS(options);
			this.source.connect(this.demuxer);
			if (!options.disableWebAssembly && WASM.IsSupported()) {
				this.wasmModule = WASM.GetModule();
				options.wasmModule = this.wasmModule;
			}
			if (options.video !== false) {
				this.video = options.wasmModule ? new MPEG1WASM(options) : new MPEG1(options);
				this.renderer = !options.disableGl && WebGLRenderer.IsSupported() ? new WebGLRenderer(options) : new CanvasRenderer(options);
				this.demuxer.connect(TS.STREAM.VIDEO_1, this.video);
				this.video.connect(this.renderer);
			}
			if (options.audio !== false && WebAudioOut.IsSupported()) {
				this.audio = options.wasmModule ? new MP2WASM(options) : new MP2(options);
				this.audioOut = new WebAudioOut(options);
				this.demuxer.connect(TS.STREAM.AUDIO_1, this.audio);
				this.audio.connect(this.audioOut);
			}
			Object.defineProperty(this, "currentTime", {
				get: this.getCurrentTime,
				set: this.setCurrentTime
			});
			Object.defineProperty(this, "volume", {
				get: this.getVolume,
				set: this.setVolume
			});
			this.paused = true;
			this.destroyed = false;
			this.unpauseOnShow = false;
			if (options.pauseWhenHidden !== false) {
				this.showHideBound = this.showHide.bind(this);
				document.addEventListener("visibilitychange", this.showHideBound);
			}
			if (this.wasmModule) {
				if (this.wasmModule.ready) this.startLoading();
				else {
					const wasm = Base64ToArrayBuffer(WASM_BINARY_default);
					this.wasmModule.loadFromBuffer(wasm, this.startLoading.bind(this));
				}
			} else this.startLoading();
		}
		startLoading() {
			if (this.destroyed) return;
			this.source.start();
			if (this.autoplay) this.play();
		}
		showHide() {
			if (document.visibilityState === "hidden") {
				this.unpauseOnShow = this.wantsToPlay;
				this.pause();
			} else if (this.unpauseOnShow) this.play();
		}
		play() {
			if (this.animationId) return;
			this.animationId = requestAnimationFrame(this.update.bind(this));
			this.wantsToPlay = true;
			this.paused = false;
		}
		pause() {
			if (this.paused) return;
			cancelAnimationFrame(this.animationId);
			this.animationId = null;
			this.wantsToPlay = false;
			this.isPlaying = false;
			this.paused = true;
			if (this.audio && this.audio.canPlay) {
				const time = this.currentTime;
				this.audioOut.stop();
				this.seek(time);
			}
			if (this.hooks.pause) this.hooks.pause();
			if (this.options.onPause) this.options.onPause(this);
		}
		getVolume() {
			return this.audioOut ? this.audioOut.volume : 0;
		}
		setVolume(volume) {
			if (this.audioOut) this.audioOut.volume = volume;
		}
		stop() {
			this.pause();
			this.seek(0);
			if (this.video && this.options.decodeFirstFrame !== false) this.video.decode();
			if (this.hooks.stop) this.hooks.stop();
		}
		destroy() {
			this.destroyed = true;
			this.pause();
			this.source.destroy();
			this.video && this.video.destroy();
			this.renderer && this.renderer.destroy();
			this.audio && this.audio.destroy();
			this.audioOut && this.audioOut.destroy();
			if (this.showHideBound) {
				document.removeEventListener("visibilitychange", this.showHideBound);
				this.showHideBound = null;
			}
		}
		seek(time) {
			const startOffset = this.audio && this.audio.canPlay ? this.audio.startTime : this.video.startTime;
			if (this.video) this.video.seek(time + startOffset);
			if (this.audio) this.audio.seek(time + startOffset);
			this.startTime = Now() - time;
		}
		getCurrentTime() {
			return this.audio && this.audio.canPlay ? this.audio.currentTime - this.audio.startTime : this.video.currentTime - this.video.startTime;
		}
		setCurrentTime(time) {
			this.seek(time);
		}
		update() {
			this.animationId = requestAnimationFrame(this.update.bind(this));
			if (!this.source.established) {
				if (this.renderer) this.renderer.renderProgress(this.source.progress);
				return;
			}
			if (!this.isPlaying) {
				this.isPlaying = true;
				this.startTime = Now() - this.currentTime;
				if (this.hooks.play) this.hooks.play();
				if (this.options.onPlay) this.options.onPlay(this);
			}
			if (this.options.streaming) this.updateForStreaming();
			else this.updateForStaticFile();
		}
		nextFrame() {
			if (this.source.established && this.video) return this.video.decode();
			return false;
		}
		updateForStreaming() {
			if (this.video) this.video.decode();
			if (this.audio) {
				let decoded = false;
				do {
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
			if (this.audio && this.audio.canPlay) {
				while (!notEnoughData && this.audio.decodedTime - this.audio.currentTime < .25) notEnoughData = !this.audio.decode();
				if (this.video && this.video.currentTime < this.audio.currentTime) notEnoughData = !this.video.decode();
				headroom = this.demuxer.currentTime - this.audio.currentTime;
			} else if (this.video) {
				const targetTime = Now() - this.startTime + this.video.startTime;
				const lateTime = targetTime - this.video.currentTime;
				const frameTime = 1 / this.video.frameRate;
				if (this.video && lateTime > 0) {
					if (lateTime > frameTime * 2) this.startTime += lateTime;
					notEnoughData = !this.video.decode();
				}
				headroom = this.demuxer.currentTime - targetTime;
			}
			this.source.resume(headroom);
			if (notEnoughData && this.source.completed) {
				if (this.loop) this.seek(0);
				else {
					this.stop();
					if (this.options.onEnded) this.options.onEnded(this);
				}
			} else if (notEnoughData && this.options.onStalled) this.options.onStalled(this);
		}
	};
	// \0@oxc-project+runtime@0.156.0/helpers/esm/typeof.js
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	// \0@oxc-project+runtime@0.156.0/helpers/esm/toPrimitive.js
	function toPrimitive(t, r) {
		if ("object" != _typeof(t) || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != _typeof(i)) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}
	// \0@oxc-project+runtime@0.156.0/helpers/esm/toPropertyKey.js
	function toPropertyKey(t) {
		var i = toPrimitive(t, "string");
		return "symbol" == _typeof(i) ? i : i + "";
	}
	// \0@oxc-project+runtime@0.156.0/helpers/esm/defineProperty.js
	function _defineProperty(e, r, t) {
		return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
			value: t,
			enumerable: !0,
			configurable: !0,
			writable: !0
		}) : e[r] = t, e;
	}
	// \0@oxc-project+runtime@0.156.0/helpers/esm/objectSpread2.js
	function ownKeys(e, r) {
		var t = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var o = Object.getOwnPropertySymbols(e);
			r && (o = o.filter(function(r) {
				return Object.getOwnPropertyDescriptor(e, r).enumerable;
			})), t.push.apply(t, o);
		}
		return t;
	}
	function _objectSpread2(e) {
		for (var r = 1; r < arguments.length; r++) {
			var t = null != arguments[r] ? arguments[r] : {};
			r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
				_defineProperty(e, r, t[r]);
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
				Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
			});
		}
		return e;
	}
	// src/lib/video-element.js
	var VideoElement = class {
		constructor(wrapper, videoUrl, { canvas = "", poster = "", autoplay = false, autoSetWrapperSize = false, loop = false, control = true, decodeFirstFrame = true, picMode = false, progressive = true, chunkSize = 1048576, hooks = {} } = {}, overlayOptions = {}) {
			this.options = _objectSpread2({
				videoUrl,
				canvas,
				poster,
				picMode,
				autoplay,
				autoSetWrapperSize,
				loop,
				control,
				decodeFirstFrame,
				progressive,
				chunkSize,
				hooks: _objectSpread2({
					play: () => {},
					pause: () => {},
					stop: () => {},
					load: () => {}
				}, hooks)
			}, overlayOptions);
			this.options.needPlayButton = this.options.control && !this.options.picMode;
			this.player = null;
			this.els = {
				wrapper: isString_default(wrapper) ? document.querySelector(wrapper) : wrapper,
				canvas: null,
				playButton: document.createElement("div"),
				unmuteButton: null,
				poster: null
			};
			if (window.getComputedStyle(this.els.wrapper).getPropertyValue("position") === "static") this.els.wrapper.style.position = "relative";
			this.els.wrapper.clientRect = this.els.wrapper.getBoundingClientRect();
			this.initCanvas();
			this.initPlayButton();
			this.initPlayer();
		}
		initCanvas() {
			if (this.options.canvas) this.els.canvas = isString_default(this.options.canvas) ? document.querySelector(this.options.canvas) : this.options.canvas;
			else {
				this.els.canvas = document.createElement("canvas");
				this.els.canvas.classList.add(style_module_default.canvas);
				this.els.wrapper.appendChild(this.els.canvas);
			}
		}
		initPlayer() {
			this.options = Object.assign(this.options, { canvas: this.els.canvas });
			const _options = _objectSpread2(_objectSpread2({}, this.options), {}, { autoplay: false });
			this.player = new Player(this.options.videoUrl, _options, {
				play: () => {
					if (this.options.needPlayButton) this.els.playButton.classList.add(style_module_default.hidden);
					if (this.els.poster) this.els.poster.classList.add(style_module_default.hidden);
					this.options.hooks.play();
				},
				pause: () => {
					if (this.options.needPlayButton) this.els.playButton.classList.remove(style_module_default.hidden);
					this.options.hooks.pause();
				},
				stop: () => {
					if (this.els.poster) this.els.poster.classList.remove(style_module_default.hidden);
					this.options.hooks.stop();
				},
				load: () => {
					if (this.options.autoplay) this.play();
					this._autoSetWrapperSize();
					this.options.hooks.load();
				}
			});
			this._copyPlayerFuncs();
			this.els.wrapper.playerInstance = this.player;
			if (this.options.poster && !this.options.autoplay && !this.player.options.streaming) {
				this.options.decodeFirstFrame = false;
				this.els.poster = new Image();
				this.els.poster.src = this.options.poster;
				this.els.poster.classList.add(style_module_default.poster);
				this.els.wrapper.appendChild(this.els.poster);
			}
			if (!this.player.options.streaming) this.els.wrapper.addEventListener("click", this.onClick.bind(this));
			if (this.options.autoplay || this.player.options.streaming) this.els.playButton.classList.add(style_module_default.hidden);
			if (this.player.audioOut && !this.player.audioOut.unlocked) {
				let unlockAudioElement = this.els.wrapper;
				if (this.options.autoplay || this.player.options.streaming) {
					this.els.unmuteButton = document.createElement("div");
					this.els.unmuteButton.innerHTML = UNMUTE_BUTTON;
					this.els.unmuteButton.classList.add(style_module_default.unmuteButton);
					this.els.wrapper.appendChild(this.els.unmuteButton);
					unlockAudioElement = this.els.unmuteButton;
				}
				this.unlockAudioBound = this.onUnlockAudio.bind(this, unlockAudioElement);
				unlockAudioElement.addEventListener("touchstart", this.unlockAudioBound, false);
				unlockAudioElement.addEventListener("click", this.unlockAudioBound, true);
				this.player.audioOut.onUnlock = () => this.onAudioUnlocked(unlockAudioElement);
			}
		}
		initPlayButton() {
			if (!this.options.needPlayButton) return;
			this.els.playButton.classList.add(style_module_default.playButton);
			this.els.playButton.innerHTML = PLAY_BUTTON;
			this.els.wrapper.appendChild(this.els.playButton);
		}
		_autoSetWrapperSize() {
			if (!this.options.autoSetWrapperSize) return Promise.resolve();
			const { destination } = this.player.video;
			if (!destination) return Promise.resolve();
			return Promise.resolve().then(() => functionToPromise_default(() => {
				this.els.wrapper.style.width = `${destination.width}px`;
				this.els.wrapper.style.height = `${destination.height}px`;
			}));
		}
		onAudioUnlocked(element) {
			if (this.els.unmuteButton) this.els.unmuteButton.classList.add(style_module_default.hidden);
			if (element && this.unlockAudioBound) {
				element.removeEventListener("touchstart", this.unlockAudioBound);
				element.removeEventListener("click", this.unlockAudioBound);
			}
		}
		onUnlockAudio(element, ev) {
			if (this.els.unmuteButton) {
				ev.preventDefault();
				ev.stopPropagation();
			}
			this.player.audioOut.unlock(() => this.onAudioUnlocked(element));
		}
		onClick() {
			if (!this.options.control) return;
			if (this.player.isPlaying) this.pause();
			else this.play();
		}
		/**
		* copy player functions
		* @private
		*/
		_copyPlayerFuncs() {
			this.play = () => this.player.play();
			this.pause = () => this.player.pause();
			this.stop = () => this.player.stop();
			this.destroy = () => {
				this.player.destroy();
				this.els.wrapper.innerHTML = "";
				this.els.wrapper.playerInstance = null;
			};
		}
	};
	// src/utils.js
	function Now() {
		return window.performance ? window.performance.now() / 1e3 : Date.now() / 1e3;
	}
	function CreateVideoElements() {
		const elements = document.querySelectorAll(".jsmpeg");
		for (let i = 0; i < elements.length; i++) new VideoElement(elements[i]);
	}
	function Fill(array, value) {
		if (array.fill) array.fill(value);
		else for (let i = 0; i < array.length; i++) array[i] = value;
	}
	function Base64ToArrayBuffer(base64) {
		const binary = window.atob(base64);
		const { length } = binary;
		const bytes = new Uint8Array(length);
		for (let i = 0; i < length; i++) bytes[i] = binary.charCodeAt(i);
		return bytes.buffer;
	}
	// src/lib/ajax-progressive.js
	function RangeURL(url, start, end) {
		const hashIndex = url.indexOf("#");
		const base = hashIndex === -1 ? url : url.slice(0, hashIndex);
		const hash = hashIndex === -1 ? "" : url.slice(hashIndex);
		if (base.includes("?")) return url;
		return `${base}?${start}-${end}${hash}`;
	}
	var AjaxProgressiveSource = class {
		constructor(url, options) {
			this.url = url;
			this.destination = null;
			this.request = null;
			this.streaming = false;
			this.completed = false;
			this.established = false;
			this.progress = 0;
			this.fileSize = 0;
			this.loadedSize = 0;
			this.chunkSize = options.chunkSize || 1048576;
			this.isLoading = false;
			this.loadStartTime = 0;
			this.loadFails = 0;
			this.throttled = options.throttled !== false;
			this.aborted = false;
			this.onEstablishedCallback = options.onSourceEstablished;
			this.onCompletedCallback = options.onSourceCompleted;
			if (options.hookOnEstablished) this.hookOnEstablished = options.hookOnEstablished;
		}
		connect(destination) {
			this.destination = destination;
		}
		start() {
			this.request = new XMLHttpRequest();
			this.request.onreadystatechange = () => {
				if (this.request.readyState === this.request.DONE) {
					this.fileSize = parseInt(this.request.getResponseHeader("Content-Length"), 10);
					this.loadNextChunk();
				}
			};
			this.request.onprogress = this.onProgress.bind(this);
			this.request.open("HEAD", this.url);
			this.request.send();
		}
		resume(secondsHeadroom) {
			if (this.isLoading || !this.throttled) return;
			if (this.loadTime * 8 + 2 > secondsHeadroom) this.loadNextChunk();
		}
		destroy() {
			this.aborted = true;
			this.isLoading = false;
			if (this.request) {
				this.request.onreadystatechange = null;
				this.request.onprogress = null;
				this.request.abort();
			}
		}
		loadNextChunk() {
			const start = this.loadedSize;
			const end = Math.min(this.loadedSize + this.chunkSize - 1, this.fileSize - 1);
			if (start >= this.fileSize || this.aborted) {
				this.completed = true;
				if (this.onCompletedCallback) this.onCompletedCallback(this);
				return;
			}
			this.isLoading = true;
			this.loadStartTime = Now();
			this.request = new XMLHttpRequest();
			this.request.onreadystatechange = () => {
				if (this.request.readyState === this.request.DONE && this.request.status >= 200 && this.request.status < 300) this.onChunkLoad(this.request.response);
				else if (this.request.readyState === this.request.DONE) {
					if (this.loadFails++ < 3) this.loadNextChunk();
				}
			};
			if (start === 0) this.request.onprogress = this.onProgress.bind(this);
			this.request.open("GET", RangeURL(this.url, start, end));
			this.request.setRequestHeader("Range", `bytes=${start}-${end}`);
			this.request.responseType = "arraybuffer";
			this.request.send();
		}
		onProgress(ev) {
			this.progress = ev.loaded / ev.total;
		}
		onChunkLoad(data) {
			const isFirstChunk = !this.established;
			this.established = true;
			this.progress = 1;
			this.loadedSize += data.byteLength;
			this.loadFails = 0;
			this.isLoading = false;
			if (isFirstChunk && this.hookOnEstablished) this.hookOnEstablished();
			if (isFirstChunk && this.onEstablishedCallback) this.onEstablishedCallback(this);
			if (this.destination) this.destination.write(data);
			this.loadTime = Now() - this.loadStartTime;
			if (!this.throttled) this.loadNextChunk();
		}
	};
	// src/lib/fetch.js
	var FetchSource = class {
		constructor(url, options) {
			this.url = url;
			this.destination = null;
			this.request = null;
			this.streaming = true;
			this.completed = false;
			this.established = false;
			this.progress = 0;
			this.aborted = false;
			this.onEstablishedCallback = options.onSourceEstablished;
			this.onCompletedCallback = options.onSourceCompleted;
			if (options.hookOnEstablished) this.hookOnEstablished = options.hookOnEstablished;
		}
		connect(destination) {
			this.destination = destination;
		}
		start() {
			const params = {
				method: "GET",
				headers: new Headers(),
				cache: "default"
			};
			self.fetch(this.url, params).then((res) => {
				if (res.ok && res.status >= 200 && res.status <= 299) {
					this.progress = 1;
					this.established = true;
					return this.pump(res.body.getReader());
				}
			}).catch((err) => {
				throw err;
			});
		}
		pump(reader) {
			return reader.read().then((result) => {
				if (result.done) this.completed = true;
				else {
					if (this.aborted) return reader.cancel();
					if (this.destination) this.destination.write(result.value.buffer);
					return this.pump(reader);
				}
			}).catch((err) => {
				throw err;
			});
		}
		resume() {}
		abort() {
			this.aborted = true;
		}
		destroy() {
			this.aborted = true;
		}
	};
	return {
		Player,
		VideoElement,
		BitBuffer,
		Source: {
			Ajax: AjaxSource,
			AjaxProgressive: AjaxProgressiveSource,
			WebSocket: WSSource,
			Fetch: FetchSource
		},
		Demuxer: { TS },
		Decoder: {
			Base: BaseDecoder,
			MPEG1Video: MPEG1,
			MPEG1VideoWASM: MPEG1WASM,
			MP2Audio: MP2,
			MP2AudioWASM: MP2WASM
		},
		Renderer: {
			WebGL: WebGLRenderer,
			Canvas2D: CanvasRenderer
		},
		AudioOutput: { WebAudio: WebAudioOut },
		WASMModule: WASM,
		Now,
		CreateVideoElements,
		Fill,
		Base64ToArrayBuffer,
		WASM_BINARY_INLINED: WASM_BINARY_default
	};
});
