module.exports = function(config) {
  config.set({
    frameworks: [ 'mocha' ],

    browsers: [
      'Chrome'
    ],

    files: [
      './testing/bundles/dom.spec.js'
    ],

    singleRun: true,

    plugins: [
      'karma-mocha',
      'karma-chrome-launcher'
    ],

    //logLevel: config.LOG_DEBUG,

    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
      exitOnResourceError: true
    }
  })
}