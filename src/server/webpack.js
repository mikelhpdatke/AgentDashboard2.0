// External libraries
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
// eslint-disable-next-line import/no-extraneous-dependencies
const webpackDevServer = require('webpack-dev-server');

const config = require('../../webpack.config.js');

config.entry.app.unshift(
  'webpack-dev-server/client?http://localhost:8080/',
  'webpack/hot/dev-server'
);

console.log(config);
const compiler = webpack(config);
// eslint-disable-next-line new-cap
const server = new webpackDevServer(compiler, {
  hot: true,
  historyApiFallback: true,
  proxy: {
    '/api': {
      target: 'http://localhost:8081',
      secure: false,
    },
  },
});
server.listen(8080);
