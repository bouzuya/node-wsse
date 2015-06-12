coffee = require 'gulp-coffee'
del = require 'del'
espower = require 'gulp-espower'
gulp = require 'gulp'
gutil = require 'gulp-util'
mocha = require 'gulp-mocha'
run = require 'run-sequence'
sourcemaps = require 'gulp-sourcemaps'
watch = require 'gulp-watch'

ignoreError = (stream) ->
  stream.on 'error', (e) ->
    gutil.log e
    @emit 'end'

gulp.task 'build', ->
  gulp.src './src/**/*.coffee'
  .pipe coffee(bare: true)
  .pipe gulp.dest './lib/'

gulp.task 'build-dev', ->
  gulp.src './src/**/*.coffee'
  .pipe sourcemaps.init()
  .pipe ignoreError coffee(bare: true)
  .pipe sourcemaps.write()
  .pipe gulp.dest './.tmp/src/'

gulp.task 'build-test', ->
  gulp.src './test/**/*.coffee'
  .pipe sourcemaps.init()
  .pipe coffee()
  .pipe espower()
  .pipe sourcemaps.write()
  .pipe gulp.dest './.tmp/test/'

gulp.task 'build-test-dev', ->
  gulp.src './test/**/*.coffee'
  .pipe sourcemaps.init()
  .pipe ignoreError coffee()
  .pipe ignoreError espower()
  .pipe sourcemaps.write()
  .pipe gulp.dest './.tmp/test/'

gulp.task 'clean', (done) ->
  del [
    './.tmp/'
    './lib/'
  ], done
  null

gulp.task 'default', (done) ->
  run.apply run, [
    'clean'
    'build'
    done
  ]
  null

gulp.task 'test', ['build-dev', 'build-test'], ->
  gulp.src './.tmp/test/**/*.js'
  .pipe mocha()

gulp.task 'test-dev', ['build-test-dev'], ->
  gulp.src './.tmp/test/**/*.js'
  .pipe ignoreError mocha()

gulp.task 'watch', ['build-dev'], ->
  watch [
    './src/**/*.coffee'
    './test/**/*.coffee'
  ], ->
    run.apply run, [
      'build-dev'
      'test-dev'
      ->
    ]
