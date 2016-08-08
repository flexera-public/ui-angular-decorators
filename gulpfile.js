var gulp = require('gulp');

var karma = require('karma');

var rollup = require('rollup');
var babel = require('rollup-plugin-babel');
var typescript = require('rollup-plugin-typescript');
var commonjs = require('rollup-plugin-commonjs');
var nodeResolve = require('rollup-plugin-node-resolve');

// Compiles and bundles TypeScript to JavaScript
function compile(source, destination) {
  return rollup.rollup({
    entry: source,
    treeshake: false,
    plugins: [
      typescript({
        target: 'ES6',
        module: 'es2015',
        moduleResolution: 'node',
        emitDecoratorMetadata: false,
        experimentalDecorators: true,
        noImplicitAny: true,
        removeComments: true,
        typescript: require('typescript')
      }),
      babel({
        exclude: 'node_modules/**',
        presets: [["es2015", { modules: false }]],
        plugins: ["external-helpers"]
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
    return bundle.write({ dest: destination });
  })
}

gulp.task('clean', cb => {
  var del = require('del');
  del(['build/**/*', '.tmp/**/*'], cb);
});

/**********************************************************************
 * Tasks to build and run the tests
 */

gulp.task('spec:compile', () => {
  return compile('src/spec.ts', '.tmp/spec.js');
})

gulp.task('spec', ['spec:compile'], (cb) => {
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

gulp.task('spec:debug', ['spec:compile'], (cb) => {
  var path = require('path');
  new karma.Server(
    {
      configFile: path.resolve('karma.conf.js'),
      browsers: ['Chrome'],
      singleRun: false
    }).start();
});
