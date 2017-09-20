import JSMpeg from '../dist/JSMpeg';

describe('ui spec', () => {
  const
    videoWrapper = document.createElement('div')
    , poster = 'https://cycjimmy.github.io/staticFiles/images/screenshot/big_buck_bunny_640x360.jpg'
    , videoUrl = 'https://cycjimmy.github.io/staticFiles/media/big_buck_bunny_640x360.ts'
  ;

  videoWrapper.id = 'videoWrapper';
  videoWrapper.style.width = '640px';
  videoWrapper.style.height = '360px';

  let
    videoDefault = new JSMpeg.VideoElement(videoWrapper, videoUrl, {
      poster,
    })
  ;

  test('videoDefault.wrapper should be videoWrapper', () => {
    expect(videoDefault.wrapper.id).toBe('videoWrapper');
    expect(videoDefault.wrapper).toBe(videoWrapper);
  });

  test('videoWrapper.playerInstance should be videoDefault.player', () => {
    expect(videoWrapper.playerInstance).toBe(videoDefault.player);
  });

  test('videoWrapper height should be equal to container height', () => {
    expect(videoWrapper).not.toBe(videoDefault.container);
    expect(videoDefault.container.parentNode).toBe(videoWrapper);
    expect(videoWrapper.offsetHeight).toBe(videoDefault.container.offsetHeight);
  });
});
