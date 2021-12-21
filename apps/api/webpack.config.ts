// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = (config, context) => ({
  ...config,
  externals: {
    _http_common: 'commonjs2 _http_common',
    encoding: 'commonjs2 encoding',
  },
  experiments: {
    topLevelAwait: true,
  },
});
