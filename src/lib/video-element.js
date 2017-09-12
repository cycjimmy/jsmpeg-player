import Player from './player';

let VideoElement = function (wrapper, videoUrl, options) {
  // Setup the div container, canvas and play button
  var addStyles = function (element, styles) {
    for (var name in styles) {
      element.style[name] = styles[name];
    }
  };

  this.wrapper = wrapper;

  this.container = document.createElement('div');
  addStyles(this.container, {
    position: 'relative',
    width: '100%',
    minWidth: '80px',
    height: '0',
    paddingBottom: options.aspectPercent || '56.25%',
  });
  this.wrapper.appendChild(this.container);

  // 赋值wrapper高度，防止销毁时页面抖动
  this.setWrapperHeight = () => {
    this.wrapper.style.height = this.container.offsetHeight + 'px';
  };
  this.setWrapperHeight();
  window.addEventListener('resize', this.setWrapperHeight);

  this.canvas = document.createElement('canvas');
  addStyles(this.canvas, {
    position: 'absolute',
    top: '0',
    left: '0',
    display: 'block',
    width: '100%',
    height: '100%',
  });
  this.container.appendChild(this.canvas);

  this.playButton = document.createElement('div');
  this.playButton.innerHTML = VideoElement.PLAY_BUTTON;
  addStyles(this.playButton, {
    zIndex: 2, position: 'absolute',
    top: '0', bottom: '0', left: '0', right: '0',
    maxWidth: '60px', maxHeight: '60px',
    margin: 'auto',
    opacity: '0.7',
    cursor: 'pointer'
  });
  if (options.picMode) {
    this.playButton.style.visibility = 'hidden';
  }

  this.container.appendChild(this.playButton);

  // Parse the data-options - we try to decode the values as json. This way
  // we can get proper boolean and number values. If JSON.parse() fails,
  // treat it as a string.
  let PlayerOptions = Object.assign(options, {
    canvas: this.canvas,
  });

  // Create the player instance
  this.player = new Player(videoUrl, PlayerOptions, {
    play: () => {
      this.playButton.style.display = 'none';
      if (this.poster) {
        this.poster.style.display = 'none';
      }
      if (options.hookInPlay) {
        options.hookInPlay();
      }
    },
    pause: () => {
      this.playButton.style.display = 'block';
      if (options.hookInPause) {
        options.hookInPause();
      }
    },
    stop: () => {
      if (this.poster) {
        this.poster.style.display = 'block';
      }
      if (options.hookInStop) {
        options.hookInStop();
      }
    },
  });

  wrapper.playerInstance = this.player;

  // Setup the poster element, if any
  if (options.poster && !options.autoplay && !this.player.options.streaming) {
    options.decodeFirstFrame = false;
    this.poster = new Image();
    this.poster.src = options.poster;
    this.poster.addEventListener('load', this.posterLoaded);
    addStyles(this.poster, {
      display: 'block', zIndex: 1, position: 'absolute',
      top: '0', left: '0', width: '100%', height: '100%',
    });
    this.container.appendChild(this.poster);
  }

  // Add the click handler if this video is pausable
  if (!this.player.options.streaming) {
    this.container.addEventListener('click', this.onClick.bind(this));
  }

  // Hide the play button if this video immediately begins playing
  if (options.autoplay || this.player.options.streaming) {
    this.playButton.style.display = 'none';
  }

  // Set up the unlock audio buton for iOS devices. iOS only allows us to
  // play audio after a user action has initiated playing. For autoplay or
  // streaming players we set up a muted speaker icon as the button. For all
  // others, we can simply use the play button.
  if (this.player.audioOut && !this.player.audioOut.unlocked) {
    var unlockAudioElement = this.container;

    if (options.autoplay || this.player.options.streaming) {
      this.unmuteButton = document.createElement('div');
      this.unmuteButton.innerHTML = VideoElement.UNMUTE_BUTTON;
      addStyles(this.unmuteButton, {
        zIndex: 2, position: 'absolute',
        top: '0', left: '0',
        width: '100%', height: '100%',
        opacity: '0.7',
        cursor: 'pointer'
      });
      this.container.appendChild(this.unmuteButton);
      unlockAudioElement = this.unmuteButton;
    }

    this.unlockAudioBound = this.onUnlockAudio.bind(this, unlockAudioElement);
    unlockAudioElement.addEventListener('touchstart', this.unlockAudioBound, false);
    unlockAudioElement.addEventListener('click', this.unlockAudioBound, true);
  }
};

VideoElement.prototype.onUnlockAudio = function (element, ev) {
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

VideoElement.prototype.onClick = function (ev) {
  if (this.player.isPlaying) {
    this.player.pause();
  }
  else {
    this.player.play();
  }
};

// 自定义清理
VideoElement.prototype.destroy = function () {
  this.player.destroy();
  this.wrapper.innerHTML = '';
  window.removeEventListener('resize', this.setWrapperHeight);
};

VideoElement.PLAY_BUTTON = `
<svg style="max-width: 60px; max-height: 60px; fill: #fff;" viewBox="0 0 64 64">
	<path d="M26,45.5L44,32L26,18.6v27V45.5L26,45.5z M32,2C15.4,2,2,15.5,2,32c0,16.6,13.4,30,30,30c16.6,0,30-13.4,30-30
	C62,15.4,48.5,2,32,2L32,2z M32,56c-9.7,0-18.5-5.9-22.2-14.8C6.1,32.2,8.1,21.9,15,15c6.9-6.9,17.2-8.9,26.2-5.2
	C50.1,13.5,56,22.3,56,32C56,45.3,45.2,56,32,56L32,56z"/>
</svg>
`;

VideoElement.UNMUTE_BUTTON = `
<svg style="position: absolute; bottom: 15px; right: 15px; width: 40px; height: 40px; fill: #fff;" viewBox="0 0 64 64">
	<path d="M58.3,45.5l-4.8-4.3c1.4-2.9,2.2-6.2,2.2-9.6c0-11.1-8.2-20.3-18.9-21.9V3.3C50.9,4.9,62,16.9,62,31.6
	C62,36.6,60.6,41.4,58.3,45.5L58.3,45.5z M30.4,5.6v15.2l-8.3-7.3L30.4,5.6L30.4,5.6z M36.7,19.9c4.6,1.9,7.9,6.4,7.9,11.7
	c0,0.6-0.1,1.1-0.1,1.7l-7.8-6.9V19.9L36.7,19.9z M57.5,60.7l-7.1-6.3c-3.9,2.9-8.6,4.8-13.7,5.4v-6.4c3.2-0.5,6.2-1.7,8.8-3.4
	l-8.1-7.2c-0.2,0.1-0.5,0.3-0.7,0.4v-1l-6.3-5.6v20.2L15.4,42.6H2V20.5h10.2l-9.7-8.6l4.2-4.7L61.7,56L57.5,60.7L57.5,60.7z"/>
</svg>
`;
export default VideoElement;

