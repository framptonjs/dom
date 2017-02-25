const { resolve } = require('path');

module.exports = {

  entry: {
    'frampton-dom': './dist/index.js'
  },

  output: {
    filename: '[name].js',
    path: resolve('dist/bundles'),
    //library: 'frampton',
    //libraryTarget: 'commonjs'
  },

  // Currently we need to add '.ts' to the resolve.extensions array.
  resolve: {
    extensions: [ '.js' ]
  },

  // Source maps support ('inline-source-map' also works)
  devtool: 'source-map'
};
