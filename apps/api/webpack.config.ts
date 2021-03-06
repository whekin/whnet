module.exports = (config, context) => ({
  ...config,
  externals: {
    _http_common: 'commonjs2 _http_common',
    encoding: 'commonjs2 encoding',
    argon2: 'commonjs2 argon2',
    bufferutil: 'commonjs2 bufferutil',
    'utf-8-validate': 'commonjs2 utf-8-validate',
  },
  experiments: {
    topLevelAwait: true,
  },
});
