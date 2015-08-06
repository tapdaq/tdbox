var Transform = require('stream').Transform;
var chalk = require('chalk');
var util = require('util');
var config = require('./../../config');

var applicationId, clientKey, orientation;

var TransformStream = function(appId, cKey, orient) {

  Transform.call(this, {objectMode: true});
  this.chunkNumber = 0;

  applicationId = appId;
  clientKey = cKey;
  orientation = orient;

};
util.inherits(TransformStream, Transform);

TransformStream.prototype._transform = function(chunk, encoding, done) {

  if (encoding === 'buffer') {

    var chunkStr = chunk.toString('utf8');


    if (this.topOfFile()) {

      if (chunkStr.indexOf(config.app_delegate_m.searchTapdaqSingleton) === -1) {

        console.log(chalk.blue('- Adding Tapdaq initializer'));
        chunkStr = addTapdaqInit(chunkStr);

      } else {
        console.log(chalk.dim('- Found Tapdaq initializer'));
      }

      if (chunkStr.indexOf(config.app_delegate_m.searchHasInterstitials) === -1) {

        console.log(chalk.blue('- Adding delegate method'));
        chunkStr = addDelegateMethod(chunkStr);

      } else {
        console.log(chalk.dim('- Found delegate method'));
      }

      var interstitialFrequency = chunkStr.match(config.app_delegate_m.searchDidBecomeActiveInterstitial);
      if (interstitialFrequency.length >= 2) {
        console.log(chalk.dim('- Found showInterstitial in didBecomeActive method'));
      } else {
        console.log(chalk.blue('- Adding showInterstitial to didBecomeActive method'));
        chunkStr = addDidBecomeActive(chunkStr);
      }

    }

    this.push(new Buffer(chunkStr, 'utf8'));

  }

  this.chunkNumber++;

  done();
};

TransformStream.prototype.topOfFile = function() {
  return (this.chunkNumber === 0);
};

var addTapdaqInit = function(chunkStr) {

  var tmpSplitString = chunkStr.split(config.app_delegate_m.searchLaunchOptions);

  if (tmpSplitString.length === 2) {
    tmpSplitString[0] += config.app_delegate_m.searchLaunchOptions + '\n' +
      config.app_delegate_m.init(applicationId, clientKey, orientation);
  }

  chunkStr = tmpSplitString.join('');

  return chunkStr;
};

var addDelegateMethod = function(chunkStr) {

  var tmpSplitString = chunkStr.split(config.app_delegate_m.end);

  tmpSplitString[0] += config.app_delegate_m.delegateMethod(orientation) + '\n\n' + config.app_delegate_m.end;

  chunkStr = tmpSplitString.join('');

  return chunkStr;
};

var addDidBecomeActive = function(chunkStr) {

  var tmpSplitString = chunkStr.split(config.app_delegate_m.searchCocosResume);

  tmpSplitString[0] += config.app_delegate_m.searchCocosResume + '\n' + config.app_delegate_m.showInterstitial;

  chunkStr = tmpSplitString.join('');

  return chunkStr;

};

module.exports = TransformStream;
