import AjaxSource from './ajax';

export default class WASM {
  constructor() {
    this.stackSize = 5 * 1024 * 1024; // emscripten default
    this.pageSize = 64 * 1024; // wasm page size
    this.onInitCallbacks = [];
    this.ready = false;
    this.loadingFromFileStarted = false;
    this.loadingFromBufferStarted = false;
  }

  write(buffer) {
    this.loadFromBuffer(buffer);
  }

  loadFromFile(url, callback) {
    if (callback) {
      this.onInitCallbacks.push(callback);
    }

    // Make sure this WASM Module is only instantiated once. If loadFromFile()
    // was already called, bail out here. On instantiation all pending
    // onInitCallbacks will be called.
    if (this.loadingFromFileStarted) {
      return;
    }
    this.loadingFromFileStarted = true;

    this.onInitCallback = callback;
    const ajax = new AjaxSource(url, {});
    ajax.connect(this);
    ajax.start();
  }

  loadFromBuffer(buffer, callback) {
    if (callback) {
      this.onInitCallbacks.push(callback);
    }

    // Make sure this WASM Module is only instantiated once. If loadFromBuffer()
    // was already called, bail out here. On instantiation all pending
    // onInitCallbacks will be called.
    if (this.loadingFromBufferStarted) {
      return;
    }
    this.loadingFromBufferStarted = true;

    this.moduleInfo = this.readDylinkSection(buffer);
    if (!this.moduleInfo) {
      for (let i = 0; i < this.onInitCallbacks.length; i++) {
        this.onInitCallbacks[i](null);
      }
      return;
    }

    this.memory = new WebAssembly.Memory({ initial: 256 });
    const env = {
      memory: this.memory,
      memoryBase: 0,
      __memory_base: 0,
      table: new WebAssembly.Table({ initial: this.moduleInfo.tableSize, element: 'anyfunc' }),
      tableBase: 0,
      __table_base: 0,
      abort: this.c_abort.bind(this),
      ___assert_fail: this.c_assertFail.bind(this),
      _sbrk: this.c_sbrk.bind(this)
    };

    this.brk = this.align(this.moduleInfo.memorySize + this.stackSize);
    WebAssembly.instantiate(buffer, { env }).then((results) => {
      this.instance = results.instance;
      if (this.instance.exports.__post_instantiate) {
        this.instance.exports.__post_instantiate();
      }
      this.createHeapViews();
      this.ready = true;
      for (let i = 0; i < this.onInitCallbacks.length; i++) {
        this.onInitCallbacks[i](this);
      }
    });
  }

  createHeapViews() {
    this.instance.heapU8 = new Uint8Array(this.memory.buffer);
    this.instance.heapU32 = new Uint32Array(this.memory.buffer);
    this.instance.heapF32 = new Float32Array(this.memory.buffer);
  }

  align(addr) {
    // eslint-disable-next-line no-restricted-properties
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

  // eslint-disable-next-line no-unused-vars,class-methods-use-this
  c_abort(size) {
    // eslint-disable-next-line prefer-rest-params
    console.warn('JSMPeg: WASM abort', arguments);
  }

  // eslint-disable-next-line no-unused-vars,class-methods-use-this
  c_assertFail(size) {
    // eslint-disable-next-line prefer-rest-params
    console.warn('JSMPeg: WASM ___assert_fail', arguments);
  }

  // eslint-disable-next-line class-methods-use-this
  readDylinkSection(buffer) {
    // Read the WASM header and dylink section of the .wasm binary data
    // to get the needed table size and static data size.

    // https://github.com/WebAssembly/tool-conventions/blob/master/DynamicLinking.md
    // https://github.com/kripken/emscripten/blob/20602efb955a7c6c20865a495932427e205651d2/src/support.js

    const bytes = new Uint8Array(buffer);
    let next = 0;

    const readVarUint = () => {
      let ret = 0;
      let mul = 1;
      // eslint-disable-next-line no-constant-condition
      while (1) {
        const byte = bytes[next++];
        ret += (byte & 0x7f) * mul;
        mul *= 0x80;
        if (!(byte & 0x80)) {
          return ret;
        }
      }
    };

    const matchNextBytes = (expected) => {
      for (let i = 0; i < expected.length; i++) {
        const b = typeof expected[i] === 'string' ? expected[i].charCodeAt(0) : expected[i];
        if (bytes[next++] !== b) {
          return false;
        }
      }
      return true;
    };

    // Make sure we have a wasm header
    if (!matchNextBytes([0, 'a', 's', 'm'])) {
      console.warn('JSMpeg: WASM header not found');
      return null;
    }

    // Make sure we have a dylink section
    next = 9;
    // eslint-disable-next-line no-unused-vars
    const sectionSize = readVarUint();
    if (!matchNextBytes([6, 'd', 'y', 'l', 'i', 'n', 'k'])) {
      console.warn('JSMpeg: No dylink section found in WASM');
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
}
