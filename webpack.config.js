const { resolve } = require('path');

module.exports = {

  entry: {
    'dom': './dist/index.js'
  },

  output: {
    filename: '[name].js',
    path: resolve('dist/bundles'),
    library: '@frampton/dom',
    libraryTarget: 'commonjs2'
  },

  // Currently we need to add '.ts' to the resolve.extensions array.
  resolve: {
    extensions: [ '.js' ]
  },

  externals : {
    '@frampton/core': {
      commonjs2: "@frampton/core"
    },
    '@frampton/style': {
      commonjs2: "@frampton/style"
    },
    '@frampton/events': {
      commonjs2: "@frampton/events"
    }
  },

  // Source maps support ('inline-source-map' also works)
  devtool: 'source-map'
};
