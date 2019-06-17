module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: 'defaults',
        modules: 'auto',
      },
    ],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
  plugins: [['@babel/plugin-proposal-class-properties', { loose: true }]],
};
