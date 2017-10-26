var
  gulp = require('gulp')
  , ghPages = require('gulp-gh-pages')
;


// Deploy to ghPages
gulp.task('deploy', function () {
  return gulp
    .src(['dist/**/*', '!dist/**/*.map'])
    .pipe(ghPages());
});
