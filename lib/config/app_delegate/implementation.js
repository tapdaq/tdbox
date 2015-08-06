module.exports = function () {

  'use strict';
  var impl = {};

  impl.init = function(applicationId, clientKey, orientation) {

    var str = '\n\t\tself.interstitialShown = NO;\n\n' +
      '\t\tNSMutableDictionary *tapdaqConfig = [[NSMutableDictionary alloc] init];\n';

    if (orientation !== 'both') {

      var tdOrientation = (orientation === 'portrait') ? 'TDOrientationPortrait' : 'TDOrientationLandscape';

      str += '\t\t[tapdaqConfig setObject:[NSNumber numberWithInteger:' + tdOrientation + '] forKey:@"orientation"];\n';
    }

    str += '\t\t[tapdaqConfig setObject:@0 forKey:@"frequencyCap"];\n\n' +
        '#ifdef DEBUG\n' +
        '\t\t[tapdaqConfig setObject:@YES forKey:@"testAdvertsEnabled"];\n' +
        '#endif\n\n' +
        '\t\t[[Tapdaq sharedSession] setApplicationId:@"' + applicationId + '" clientKey:@"' + clientKey + '" config:tapdaqConfig];\n\n' +
        '\t\t[(Tapdaq *)[Tapdaq sharedSession] setDelegate:self];';

    return str;

  };

  impl.delegateMethod = function(orientation) {

    var str = '- (void)hasInterstitialsAvailableForOrientation:(TDOrientation)orientation\n' +
    '{\n' +
    '\t\tif (';

    if (orientation == 'portrait') {
      str += 'orientation == TDOrientationPortrait && ';
    } else if (orientation == 'landscape') {
      str += 'orientation == TDOrientationLandscape && ';
    }

    str += '!self.interstitialShown) {\n' +
      '\t\t\t\tself.interstitialShown = YES;\n\n' +
      '\t\t\t\t[[Tapdaq sharedSession] showInterstitial];\n' +
      '\t\t}\n}';

    return str;

  };

  impl.searchHasInterstitials = '- (void)hasInterstitialsAvailableForOrientation:(TDOrientation)orientation';
  impl.end = '@end';

  impl.searchTapdaqSingleton = '[Tapdaq sharedSession] setApplicationId';

  impl.searchLaunchOptions = 'launchOptions {';


  return impl;

};