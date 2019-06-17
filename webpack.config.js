const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const babelRc = require('./.babelrc');
const production = process.NODE_ENV === 'production';

const useSourceMaps = !production;

module.exports = {
  entry: {
    pack: './web/js/init.js',
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: babelRc,
      },
      {
        test: /\.s?css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [autoprefixer()],
              sourceMap: useSourceMaps,
              map: { inline: true },
            },
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: useSourceMaps },
          },
        ],
      },
    ],
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'web/js'),
  },
  profile: true,
  devtool: useSourceMaps ? 'cheap-module-eval-source-map' : false,
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
  },
  externals: {
    jquery: 'jQuery',
  },
};
