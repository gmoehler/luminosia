
// define child rescript
module.exports = config => {
  config.target = 'electron-renderer';
  config.node = {
    __dirname: false,
    __filename: false,
  };
  return config;
}
