const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const browsersListBrowsers = ['defaults'];
const useSourceMaps = true;

module.exports = ({ config }) => {
  config.resolve.extensions.push('.ts', '.tsx');
  config.module.rules[0].test = /\.(jsx?|tsx?)$/;
  config.module.rules.push({
    test: /\.s?css$/,
    use: [
      { loader: 'style-loader' },
      {
        loader: 'css-loader',
      },
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
  });

  return config;
};
