// Regression test for the decoder lifetime in src/lib/mp2-wasm.js.
//
// The module imports `Now` from ../utils, which reaches the DOM, so it is
// loaded with that import stubbed out. The other two imports are plain modules
// and are loaded through their real file URLs.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { it } from 'node:test';

const decoderUrl = new URL('../src/lib/decoder.js', import.meta.url).href;
const bufferUrl = new URL('../src/lib/buffer.js', import.meta.url).href;

const source = readFileSync(new URL('../src/lib/mp2-wasm.js', import.meta.url), 'utf8')
  .replace("import { Now } from '../utils';", 'const Now = () => 0;')
  .replace("from './decoder'", `from '${decoderUrl}'`)
  .replace("from './buffer'", `from '${bufferUrl}'`);

const { default: MP2WASM } = await import(
  `data:text/javascript;base64,${Buffer.from(`${source}\n// ${Date.now()}`).toString('base64')}`
);

const createMP2WASM = () => {
  const calls = { create: 0, writes: 0, destroy: 0 };
  const exports = {
    _mp2_decoder_create: () => {
      calls.create += 1;
      return 1024;
    },
    _mp2_decoder_destroy: () => { calls.destroy += 1; },
    _mp2_decoder_get_write_ptr: () => 0,
    _mp2_decoder_did_write: () => { calls.writes += 1; },
  };

  const audio = new MP2WASM({
    wasmModule: {
      instance: {
        exports,
        heapU8: new Uint8Array(2048),
        heapF32: new Float32Array(1024),
      },
    },
  });

  return { audio, calls };
};

it('does not bring the decoder back to life through a late write', () => {
  const { audio, calls } = createMP2WASM();

  audio.write(0, [new Uint8Array([1, 2, 3, 4])]);
  assert.equal(calls.create, 1);
  assert.equal(calls.writes, 1);
  assert.equal(audio.canPlay, true);
  assert.equal(audio.bytesWritten, 4);

  audio.destroy();
  assert.equal(calls.destroy, 1);
  assert.equal(audio.decoder, null);
  assert.equal(audio.canPlay, false);

  // A source can still deliver inside the very callback that destroys the
  // player: the chunk must be dropped instead of allocating a new decoder.
  audio.write(1, [new Uint8Array([5, 6])]);

  assert.equal(calls.create, 1);
  assert.equal(calls.writes, 1);
  assert.equal(audio.canPlay, false);
  assert.equal(audio.bytesWritten, 4);
});

it('has nothing to decode once it is destroyed', () => {
  const { audio } = createMP2WASM();
  audio.write(0, [new Uint8Array([1, 2, 3, 4])]);

  audio.destroy();

  assert.equal(audio.decode(), false);
  // The index helpers must not touch the freed pointer either.
  assert.equal(audio.bufferGetIndex(), undefined);
  assert.doesNotThrow(() => audio.bufferSetIndex(0));
});
