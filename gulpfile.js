/* jshint quotmark:single */

var gulp = require('gulp');
var _ = require('lodash');

var karma = require('karma');

var rollup = require('rollup');
var typescript = require('rollup-plugin-typescript');
var commonjs = require('rollup-plugin-commonjs');
var nodeResolve = require('rollup-plugin-node-resolve');
var uglify = require('rollup-plugin-uglify');

// Compiles and bundles TypeScript to JavaScript
function compile(source, destination) {
  return rollup.rollup({
    entry: source,
    plugins: [
      typescript({
        typescript: require('typescript')
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
      }),
      uglify({ mangle: { keep_fnames: true }, compress: { keep_fnames: true } })
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

var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json', { noEmit: true });

gulp.task('spec:verify', () => {
  var result = tsProject.src()
    .pipe(tsProject())
    .once("error", function () {
      this.once("finish", () => process.exit(1));
    });

  return result.js;
});

gulp.task('spec:compile', ['spec:verify'], () => {
  return compile('src/spec/spec.ts', '.tmp/spec.js');
});

var specs = {
  'spec': ['PhantomJS'],
  'spec:chrome': ['Chrome'],
  'spec:ie': ['IE'],
  'spec:firefox': ['Firefox'],
  'spec:edge': ['Edge'],
  'spec:full': ['Chrome', 'Firefox', 'IE', 'Edge']
}

_.forEach(specs, (v, k) => {
  gulp.task(k, ['lint', 'spec:compile'], () => {
    var path = require('path');
    new karma.Server(
      {
        configFile: path.resolve('karma.conf.js'),
        browsers: v
      }).start();
  })

  if (k.indexOf(':') > 0) {
    gulp.task(k + ':debug', ['lint', 'spec:compile'], () => {
      var path = require('path');
      new karma.Server(
        {
          configFile: path.resolve('karma.conf.js'),
          browsers: v,
          singleRun: false
        }).start();
    })
  }
})
