import JSMpeg from '../src/index';

const videoWrapper = document.createElement('div');
const poster = 'posterUrl';
const videoUrl = 'videoUrl.ts';
videoWrapper.id = 'videoWrapper';
videoWrapper.style.width = '640px';
videoWrapper.style.height = '360px';

describe('default test', () => {
  const videoDefault = new JSMpeg.VideoElement(videoWrapper, videoUrl, {
    poster
  });

  it('videoDefault.wrapper should be videoWrapper', () => {
    expect(videoDefault.els.wrapper.id).toBe('videoWrapper');
    expect(videoDefault.els.wrapper).toBe(videoWrapper);
  });

  it('videoWrapper.playerInstance should be videoDefault.player', () => {
    expect(videoWrapper.playerInstance).toBe(videoDefault.player);
  });
});
