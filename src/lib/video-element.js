import Player from './player';

// style
import _style from '../../static/theme/style.scss';

// template
import playButtonTemplate from '../../static/view/playButton.pug';
import unmuteButtonTemplate from '../../static/view/unmuteButton.pug';

// service
import isString from 'awesome-js-funcs/judgeBasic/isString';

export default class VideoElement {
  constructor(wrapper, videoUrl, {
    canvas = '',
    canvasWidth = 0,
    canvasHeight = 0,
    poster = '',
    autoplay = false,
    loop = false,
    control = true,
    decodeFirstFrame = true,
    picMode = false,
    progressive = true,
    chunkSize = 1024 * 1024,
    hooks = {}
  }, overlayOptions = {}) {

    this.options = Object.assign({
      videoUrl: videoUrl,
      canvas,
      canvasWidth,
      canvasHeight,
      poster,
      picMode,
      autoplay,
      loop,
      control,
      decodeFirstFrame,
      progressive,
      chunkSize,
      hooks: Object.assign({
        play: () => {
        },
        pause: () => {
        },
        stop: () => {
        },
        load: () => {
        },
      }, hooks),
    }, overlayOptions);

    this.options.needPlayButton = this.options.control && !this.options.picMode;

    this.player = null;

    // Setup canvas and play button
    this.els = {
      wrapper: isString(wrapper)
        ? document.querySelector(wrapper)
        : wrapper,
      canvas: null,
      playButton: document.createElement('div'),
      unmuteButton: null,
      poster: null,
    };

    this.els.wrapper.classList.add(_style.wrapper);
    this.els.wrapper.clientRect = this.els.wrapper.getBoundingClientRect();

    this.initCanvas();
    this.initPlayButton();
    this.initPlayer();
  };

  initCanvas() {
    if (this.options.canvas) {
      this.els.canvas = isString(this.options.canvas)
        ? document.querySelector(this.options.canvas)
        : this.options.canvas;
    } else {
      this.els.canvas = document.createElement('canvas');
      this.els.canvas.classList.add(_style.canvas);
      this.els.wrapper.appendChild(this.els.canvas);
    }

    this.els.canvas.width = this.options.canvasWidth
      ? this.options.canvasWidth
      : this.els.wrapper.clientRect.width;

    this.els.canvas.height = this.options.canvasHeight
      ? this.options.canvasHeight
      : this.els.wrapper.clientRect.height;
  };

  initPlayer() {
    // Parse the data-options - we try to decode the values as json. This way
    // we can get proper boolean and number values. If JSON.parse() fails,
    // treat it as a string.
    this.options = Object.assign(this.options, {
      canvas: this.els.canvas,
    });

    const _options = Object.assign({}, this.options, {
      autoplay: false,
    });

    // Create the player instance
    this.player = new Player(this.options.videoUrl, _options, {
      play: () => {
        if (this.options.needPlayButton) {
          this.els.playButton.style.display = 'none';
        }

        if (this.els.poster) {
          this.els.poster.style.display = 'none';
        }

        this.options.hooks.play();
      },
      pause: () => {
        if (this.options.needPlayButton) {
          this.els.playButton.style.display = 'block';
        }

        this.options.hooks.pause();
      },
      stop: () => {
        if (this.els.poster) {
          this.els.poster.style.display = 'block';
        }

        this.options.hooks.stop();
      },
      load: () => {
        if (this.options.autoplay) {
          this.play();
        }

        this.options.hooks.load();
      }
    });

    this._copyPlayerFuncs();
    this.els.wrapper.playerInstance = this.player;

    // Setup the poster element, if any
    if (this.options.poster && !this.options.autoplay && !this.player.options.streaming) {
      this.options.decodeFirstFrame = false;
      this.els.poster = new Image();
      this.els.poster.src = this.options.poster;
      this.els.poster.classList.add(_style.poster);
      this.els.wrapper.appendChild(this.els.poster);
    }

    // Add the click handler if this video is pausable
    if (!this.player.options.streaming) {
      this.els.wrapper.addEventListener('click', this.onClick.bind(this));
    }

    // Hide the play button if this video immediately begins playing
    if (this.options.autoplay || this.player.options.streaming) {
      this.els.playButton.style.display = 'none';
    }

    // Set up the unlock audio buton for iOS devices. iOS only allows us to
    // play audio after a user action has initiated playing. For autoplay or
    // streaming players we set up a muted speaker icon as the button. For all
    // others, we can simply use the play button.
    if (this.player.audioOut && !this.player.audioOut.unlocked) {
      let unlockAudioElement = this.els.wrapper;

      if (this.options.autoplay || this.player.options.streaming) {
        this.els.unmuteButton = document.createElement('div');
        this.els.unmuteButton.innerHTML = unmuteButtonTemplate({_style});
        this.els.unmuteButton.classList.add(_style.unmuteButton);
        this.els.wrapper.appendChild(this.els.unmuteButton);
        unlockAudioElement = this.els.unmuteButton;
      }

      this.unlockAudioBound = this.onUnlockAudio.bind(this, unlockAudioElement);
      unlockAudioElement.addEventListener('touchstart', this.unlockAudioBound, false);
      unlockAudioElement.addEventListener('click', this.unlockAudioBound, true);
    }
  };

  initPlayButton() {
    if (!this.options.needPlayButton) {
      return;
    }

    this.els.playButton.classList.add(_style.playButton);
    this.els.playButton.innerHTML = playButtonTemplate({_style});
    this.els.wrapper.appendChild(this.els.playButton);
  };

  onUnlockAudio(element, ev) {
    if (this.els.unmuteButton) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    this.player.audioOut.unlock(() => {
      if (this.els.unmuteButton) {
        this.els.unmuteButton.style.display = 'none';
      }
      element.removeEventListener('touchstart', this.unlockAudioBound);
      element.removeEventListener('click', this.unlockAudioBound);
    });
  };

  onClick() {
    if (!this.options.control) {
      return;
    }

    if (this.player.isPlaying) {
      this.pause();
    }
    else {
      this.play();
    }
  };

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
      this.els.wrapper.innerHTML = '';
      this.els.wrapper.playerInstance = null;
    };
  };
};

