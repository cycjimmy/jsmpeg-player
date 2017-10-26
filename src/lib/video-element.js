import JSMpeg from '../';

// style
import _style from '../../static/theme/style.scss';

// template
import playButtonTemplate from '../../static/view/playButton.pug';
import unmuteButtonTemplate from '../../static/view/unmuteButton.pug';

export default class VideoElement {
  constructor(wrapper, videoUrl, options) {
    // Setup the div container, canvas and play button
    this.options = Object.assign({
      videoUrl: videoUrl,
      poster: '',
      aspectPercent: '56.25%',
      picMode: false,
      autoplay: false,
      loop: false,
      decodeFirstFrame: true,
      progressive: true,
      hookInPlay: () => {
      },
      hookInPause: () => {
      },
      hookInStop: () => {
      },
    }, options);


    this.wrapper = isString(wrapper)
      ? document.querySelector(wrapper)
      : wrapper;
    this.container = document.createElement('div');
    this.canvas = document.createElement('canvas');
    this.player = null;
    this.playButton = document.createElement('div');

    this.containerInit();
    this.canvasInit();
    this.playButtonInit();
    this.playerInit();

    // Assignment height of wrapper. prevent page shake when destroyed.
    this.setWrapperHeight();
    window.addEventListener('resize', () => this.setWrapperHeight());
  };

  containerInit() {
    this.container.classList.add(_style.container);
    addStyles(this.container, {
      paddingBottom: this.options.aspectPercent,
    });
    this.wrapper.appendChild(this.container);
  };

  canvasInit() {
    this.canvas.classList.add(_style.canvas);
    this.container.appendChild(this.canvas);
  };

  playerInit() {
    // Parse the data-options - we try to decode the values as json. This way
    // we can get proper boolean and number values. If JSON.parse() fails,
    // treat it as a string.
    this.options = Object.assign(this.options, {
      canvas: this.canvas,
    });

    // Create the player instance
    this.player = new JSMpeg.Player(this.options.videoUrl, this.options, {
      play: () => {
        this.playButton.style.display = 'none';
        if (this.poster) {
          this.poster.style.display = 'none';
        }
        this.options.hookInPlay();
      },
      pause: () => {
        this.playButton.style.display = 'block';
        this.options.hookInPause();
      },
      stop: () => {
        if (this.poster) {
          this.poster.style.display = 'block';
        }
        this.options.hookInStop();
      },
    });
    this.wrapper.playerInstance = this.player;

    // Setup the poster element, if any
    if (this.options.poster && !this.options.autoplay && !this.player.options.streaming) {
      this.options.decodeFirstFrame = false;
      this.poster = new Image();
      this.poster.src = this.options.poster;
      this.poster.classList.add(_style.poster);
      this.container.appendChild(this.poster);
    }

    // Add the click handler if this video is pausable
    if (!this.player.options.streaming) {
      this.container.addEventListener('click', this.onClick.bind(this));
    }

    // Hide the play button if this video immediately begins playing
    if (this.options.autoplay || this.player.options.streaming) {
      this.playButton.style.display = 'none';
    }

    // Set up the unlock audio buton for iOS devices. iOS only allows us to
    // play audio after a user action has initiated playing. For autoplay or
    // streaming players we set up a muted speaker icon as the button. For all
    // others, we can simply use the play button.
    if (this.player.audioOut && !this.player.audioOut.unlocked) {
      let unlockAudioElement = this.container;

      if (this.options.autoplay || this.player.options.streaming) {
        this.unmuteButton = document.createElement('div');
        this.unmuteButton.innerHTML = unmuteButtonTemplate({
          _style
        });
        this.unmuteButton.classList.add(_style.unmuteButton);
        this.container.appendChild(this.unmuteButton);
        unlockAudioElement = this.unmuteButton;
      }

      this.unlockAudioBound = this.onUnlockAudio.bind(this, unlockAudioElement);
      unlockAudioElement.addEventListener('touchstart', this.unlockAudioBound, false);
      unlockAudioElement.addEventListener('click', this.unlockAudioBound, true);
    }
  };

  playButtonInit() {
    this.playButton.innerHTML = playButtonTemplate({
      _style
    });
    this.playButton.classList.add(_style.playButton);
    if (this.options.picMode) {
      this.playButton.style.visibility = 'hidden';
    }
    this.container.appendChild(this.playButton);
  };

  onUnlockAudio(element, ev) {
    if (this.unmuteButton) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    this.player.audioOut.unlock(function () {
      if (this.unmuteButton) {
        this.unmuteButton.style.display = 'none';
      }
      element.removeEventListener('touchstart', this.unlockAudioBound);
      element.removeEventListener('click', this.unlockAudioBound);
    }.bind(this));
  };

  onClick() {
    if (this.player.isPlaying) {
      this.player.pause();
    }
    else {
      this.player.play();
    }
  };

  setWrapperHeight() {
    this.wrapper.style.height = this.container.offsetHeight + 'px';
  };

  destroy() {
    this.player.destroy();
    this.wrapper.innerHTML = '';
    window.removeEventListener('resize', this.setWrapperHeight);
  };
};

let
  addStyles = (element, styles) => {
    for (let name in styles) {
      element.style[name] = styles[name];
    }
  }

  , isString = (str) => {
    return (typeof str === 'string') && str.constructor === String;
  }
;

