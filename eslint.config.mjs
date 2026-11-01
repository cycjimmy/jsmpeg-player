import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
    ignores: [
      'dist/**',
      '.release/**',
      '.publish/**',
      'docs/**',
      'temp/**',
      '.wt/**',
      'src/lib/wasm/WASM_BINARY.js',
    ],
  },
  {
    files: ['tasks/**/*.js'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    // The suite runs on `node --test`, not Vitest, so the Vitest-specific
    // rewrites do not apply here.
    files: ['test/**/*.mjs'],
    rules: {
      'test/no-import-node-test': 'off',
      'test/prefer-lowercase-title': 'off',
    },
  },
)
