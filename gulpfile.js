/* jshint quotmark:single */

var gulp = require('gulp');

var karma = require('karma');

var rollup = require('rollup');
var typescript = require('rollup-plugin-typescript');
var commonjs = require('rollup-plugin-commonjs');
var nodeResolve = require('rollup-plugin-node-resolve');
var buble = require('rollup-plugin-buble');

// Compiles and bundles TypeScript to JavaScript
function compile(source, destination) {
  return rollup.rollup({
    entry: source,
    plugins: [
      typescript({
        typescript: require('typescript')
      }),
      buble({
        exclude: 'node_modules/**'
      }),
      commonjs({
        include: 'node_modules/**',
        exclude: ['./index.ts', './src/**/*']
      }),
      nodeResolve({
        jsnext: true,
        main: true,
        browser: true,
        extensions: ['.js', '.ts', '.json'],
        preferBuiltins: false
      })
    ],
    sourceMap: true
  }).then(bundle => {
    return bundle.write({
      dest: destination,
      sourceMap: true,
      format: 'es'
    });
  })
}

gulp.task('lint', () => {
  var tslint = require('gulp-tslint');

  return gulp.src(['src/**/*.ts', 'demo/**/*.ts'])
    .pipe(tslint({
      formattersDirectory: 'node_modules/custom-tslint-formatters/formatters',
      formatter: 'grouped'
    }))
    .pipe(tslint.report({
      summarizeFailureOutput: true
    }));
});

gulp.task('clean', cb => {
  var del = require('del');
  del(['build/**/*', '.tmp/**/*'], cb);
});

/**********************************************************************
 * Tasks to build and run the tests
 */

gulp.task('spec:compile', () => {
  return compile('src/spec/spec.ts', '.tmp/spec.js');
});

gulp.task('spec', ['lint', 'spec:compile'], (cb) => {
  var path = require('path');
  new karma.Server(
    { configFile: path.resolve('karma.conf.js') },
    exitCode => {
      console.log('exit code', exitCode)
      if (exitCode !== 0) {
        process.exit(1);
      }
      cb();
    }).start();
});

gulp.task('spec:debug', ['spec:compile'], () => {
  var path = require('path');
  new karma.Server(
    {
      configFile: path.resolve('karma.conf.js'),
      browsers: ['Chrome'],
      singleRun: false
    }).start();
});
