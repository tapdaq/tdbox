var config = {};

config.app_delegate_h = require('./app_delegate/header')();
config.app_delegate_m = require('./app_delegate/implementation')();

module.exports = config;