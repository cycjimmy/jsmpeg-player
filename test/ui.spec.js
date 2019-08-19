import JSMpeg from '../build/jsmpeg-player.min';

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
    expect(videoDefault.els.wrapper.id).toBe('videoWrapper');
    expect(videoDefault.els.wrapper).toBe(videoWrapper);
  });

  test('videoWrapper.playerInstance should be videoDefault.player', () => {
    expect(videoWrapper.playerInstance).toBe(videoDefault.player);
  });
});
