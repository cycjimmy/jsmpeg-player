## [6.0.5](https://github.com/cycjimmy/jsmpeg-player/compare/v6.0.4...v6.0.5) (2022-09-22)


### Bug Fixes

* fix problems with destroying WebGL context ([558c02e](https://github.com/cycjimmy/jsmpeg-player/commit/558c02e5dd13ead15d7eabf9a130de2adaba1c05))

## [6.0.4](https://github.com/cycjimmy/jsmpeg-player/compare/v6.0.3...v6.0.4) (2022-09-05)


### Bug Fixes

* catch lost context when creating the WebGL renderer ([6a6fcc6](https://github.com/cycjimmy/jsmpeg-player/commit/6a6fcc6c75363f43f04ed2d3c980338c6095d9f6))
* fix WebSocket constructor chocking on empty protocol string ([4caa818](https://github.com/cycjimmy/jsmpeg-player/commit/4caa8181bdabd32565ce2b8c44b4282460bc0e60))

## [6.0.3](https://github.com/cycjimmy/jsmpeg-player/compare/v6.0.2...v6.0.3) (2022-06-21)


### Bug Fixes

* remove @rollup/plugin-commonjs ([15d5cfe](https://github.com/cycjimmy/jsmpeg-player/commit/15d5cfe8afb817b83541d44448f6d345e0f8acb8))

## [6.0.2](https://github.com/cycjimmy/jsmpeg-player/compare/v6.0.1...v6.0.2) (2022-03-26)


### Bug Fixes

* fix root version after releasing ([7cf298a](https://github.com/cycjimmy/jsmpeg-player/commit/7cf298abe67e664651a1122f70dac638187cfed1))

## [6.0.1](https://github.com/cycjimmy/jsmpeg-player/compare/v6.0.0...v6.0.1) (2022-03-25)


### Bug Fixes

* fix root version after releasing ([d586ed2](https://github.com/cycjimmy/jsmpeg-player/commit/d586ed2ff98784c5d686dbf82665ef61bb1f4899))

# [6.0.0](https://github.com/cycjimmy/jsmpeg-player/compare/v5.1.1...v6.0.0) (2022-03-25)


### Features

* change to module mode ([cff7d05](https://github.com/cycjimmy/jsmpeg-player/commit/cff7d057d4a33cb6eeb35669638f2b17c8bec33f))


### BREAKING CHANGES

* change to module mode

## [5.1.1](https://github.com/cycjimmy/jsmpeg-player/compare/v5.1.0...v5.1.1) (2022-03-15)


### Bug Fixes

* fix race condition where WASM-Module is instantiated twice; and rebuild ([490801a](https://github.com/cycjimmy/jsmpeg-player/commit/490801a9605c883944b5ff53c3900d9c56ea469c))
* fix typo (https://github.com/phoboslab/jsmpeg/commit/55886464d289623af9c9dd39e8080a29a0719591) ([d3cc3a5](https://github.com/cycjimmy/jsmpeg-player/commit/d3cc3a5a580170c0d3847dbc46a1904f59f77a8a))
* handle WebGL contextLost ([b04df7e](https://github.com/cycjimmy/jsmpeg-player/commit/b04df7e128be71c87fbc95b4e22acf8776f668fc))

# [5.1.0](https://github.com/cycjimmy/jsmpeg-player/compare/v5.0.1...v5.1.0) (2022-03-15)


### Features

* **deps:** upgrade deps ([2cfdb8e](https://github.com/cycjimmy/jsmpeg-player/commit/2cfdb8e26a58c3c1f6e4f6b66a6b36bde388c1b9))

## [5.0.1](https://github.com/cycjimmy/jsmpeg-player/compare/v5.0.0...v5.0.1) (2020-05-12)


### Bug Fixes

* **mp2:** fix audio only using the right channel for volume ([628844f](https://github.com/cycjimmy/jsmpeg-player/commit/628844febcc75ed6857e421becfbf8fafe72216d)), closes [#24](https://github.com/cycjimmy/jsmpeg-player/issues/24) [#24](https://github.com/cycjimmy/jsmpeg-player/issues/24)

# [5.0.0](https://github.com/cycjimmy/jsmpeg-player/compare/v4.0.4...v5.0.0) (2020-01-19)


### Features

* use rollup refactor project ([1d04cd5](https://github.com/cycjimmy/jsmpeg-player/commit/1d04cd5b1589e7481207ca4c45d4a39eddbd673c))


### BREAKING CHANGES

* use rollup refactor project

## [4.0.4](https://github.com/cycjimmy/jsmpeg-player/compare/v4.0.3...v4.0.4) (2020-01-09)


### Bug Fixes

* fix error `JSMpeg is not defined` ([556be62](https://github.com/cycjimmy/jsmpeg-player/commit/556be621890382d2cebdff89a15ace30af1bd364))
* **upgrade:** update from origin jsmpeg ([9dd8098](https://github.com/cycjimmy/jsmpeg-player/commit/9dd8098c46d88161efdf6334ddc81c621be02b93))

## [4.0.3](https://github.com/cycjimmy/jsmpeg-player/compare/v4.0.2...v4.0.3) (2019-10-24)


### Bug Fixes

* **build:** replace "uglifyjs" with "terser" ([b55be86](https://github.com/cycjimmy/jsmpeg-player/commit/b55be862c794d41ce5c88898f7f54406dc9bc3e3))

## [4.0.2](https://github.com/cycjimmy/jsmpeg-player/compare/v4.0.1...v4.0.2) (2019-10-23)


### Bug Fixes

* **release:** start to use semantic release ([fa9c554](https://github.com/cycjimmy/jsmpeg-player/commit/fa9c554cb9a0e4c2bb161e47c7267009387452ec))
