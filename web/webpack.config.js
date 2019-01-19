var path = require('path');
var production = process.NODE_ENV === 'production';

module.exports = {
  entry: {
    pack: './js/init.js',
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'flow', 'es2015'],
          plugins: ['transform-class-properties'],
        },
      },
    ],
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'js'),
  },
  profile: true,
  devtool: production ? false : '#inline-source-map',
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
  externals: {
    jquery: 'jQuery',
  },
};
