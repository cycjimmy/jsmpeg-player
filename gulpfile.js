var
  gulp = require('gulp')
  , ghPages = require('gh-pages')
;

// Deploy to ghPages
gulp.task('deploy', function () {
  return ghPages.publish('dist', {
    src: [
      '**/*',
      '!**/*.map'
    ]
  }, function (err) {
    console.error(err);
  });
});

