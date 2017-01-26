var build = require('@rightscale/ui-build-tools');

build.init({
  bundles: [{
    name: 'lib',
    root: 'src',
    library: true
  }]
});
