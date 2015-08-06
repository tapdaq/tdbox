module.exports = function () {

  'use strict';
  var header = {};

  header.import = '#import <Tapdaq/Tapdaq.h>';
  header.delegate = 'TapdaqDelegate';
  header.bool = '@property (nonatomic) BOOL interstitialShown;';

  header.searchLastBrace = '}';
  header.searchAppDelegate = 'UIApplicationDelegate';

  return header;

};