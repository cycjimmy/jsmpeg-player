var
  path = require('path')
  , gulp = require('gulp')
  , ghPages = require('gulp-gh-pages')
  , gulpCopy = require('gulp-copy')
;


gulp.task('copy', function () {
  var
    sourceFiles = path.resolve('dist', 'JSMpeg.min.js')
    , destination = path.resolve('demo')
  ;

  return gulp
    .src(sourceFiles)
    .pipe(gulpCopy(destination, {
      prefix: 1
    }));
});

// Deploy to ghPages
gulp.task('deploy', function () {
  return gulp
    .src('demo/**/*')
    .pipe(ghPages());
});





