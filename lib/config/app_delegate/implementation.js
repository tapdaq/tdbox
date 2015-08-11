module.exports = function () {

  'use strict';
  var impl = {};

  impl.init = function(applicationId, clientKey, orientation, testAds, frequencyCap) {

    var str = '\n\tself.interstitialShown = NO;\n\n' +
      '\tNSMutableDictionary *tapdaqConfig = [[NSMutableDictionary alloc] init];\n';

    if (orientation !== 'both') {

      var tdOrientation = (orientation === 'portrait') ? 'TDOrientationPortrait' : 'TDOrientationLandscape';

      str += '\t[tapdaqConfig setObject:[NSNumber numberWithInteger:' + tdOrientation + '] forKey:@"orientation"];\n';
    }

    var testAdsStr = (testAds === false) ? "NO" : "YES";

    str += '\t[tapdaqConfig setObject:@' + frequencyCap + ' forKey:@"frequencyCap"];\n\n' +
        '\t[tapdaqConfig setObject:@' + testAdsStr + ' forKey:@"testAdvertsEnabled"];\n' +
        '\t[[Tapdaq sharedSession] setApplicationId:@"' + applicationId + '" clientKey:@"' + clientKey + '" config:tapdaqConfig];\n\n' +
        '\t[(Tapdaq *)[Tapdaq sharedSession] setDelegate:self];';

    return str;

  };

  impl.delegateMethod = function(orientation) {

    var str = '- (void)hasInterstitialsAvailableForOrientation:(TDOrientation)orientation\n' +
    '{\n' +
    '\tif (';

    if (orientation == 'portrait') {
      str += 'orientation == TDOrientationPortrait && ';
    } else if (orientation == 'landscape') {
      str += 'orientation == TDOrientationLandscape && ';
    }

    str += '!self.interstitialShown) {\n' +
      '\t\tself.interstitialShown = YES;\n\n' +
      '\t\t[[Tapdaq sharedSession] showInterstitial];\n' +
      '\t}\n}';

    return str;

  };

  impl.showInterstitial = '\t[[Tapdaq sharedSession] showInterstitial];\n';

  impl.searchDidBecomeActiveInterstitial = /\[\[Tapdaq sharedSession\] showInterstitial\]\;/mg;

  impl.searchCocosResume = 'cocos2d::CCDirector::sharedDirector()->resume();';

  impl.searchHasInterstitials = '- (void)hasInterstitialsAvailableForOrientation:(TDOrientation)orientation';
  impl.end = '@end';

  impl.searchTapdaqSingleton = '[Tapdaq sharedSession] setApplicationId';

  impl.searchLaunchOptions = 'launchOptions {';


  return impl;

};