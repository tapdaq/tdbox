var Transform = require('stream').Transform;
var chalk = require('chalk');
var util = require('util');
var config = require('./../../config');

var TransformStream = function() {
  Transform.call(this, {objectMode: true});
  this.chunkNumber = 0;
};
util.inherits(TransformStream, Transform);

TransformStream.prototype._transform = function(chunk, encoding, done) {

  if (encoding === 'buffer') {

    var chunkStr = chunk.toString('utf8');


    if (this.topOfFile()) {

      if (chunkStr.indexOf(config.app_delegate_h.import) === -1) {

        console.log(chalk.blue('- Adding import statement'));
        chunkStr = addImportStatement(chunkStr);

      } else {
        console.log(chalk.dim('- Found import statement'));
      }

      if (chunkStr.indexOf(config.app_delegate_h.delegate) === -1) {

        console.log(chalk.blue('- Adding delegate'));
        chunkStr = addDelegateStatement(chunkStr);

      } else {
        console.log(chalk.dim('- Found delegate'));
      }

      if (chunkStr.indexOf(config.app_delegate_h.bool) === -1) {

        console.log(chalk.blue('- Added interstitialShown boolean'));
        chunkStr = addInterstitialShown(chunkStr);

      } else {

        console.log(chalk.dim('- Found interstitialShown boolean'));

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

var addImportStatement = function(chunkStr) {

  var tmpStr = config.app_delegate_h.import + "\n";
  tmpStr += chunkStr;
  chunkStr = tmpStr;

  return chunkStr;
};

var addDelegateStatement = function(chunkStr) {

  var tmpSplitString = chunkStr.split(config.app_delegate_h.searchAppDelegate);

  if (tmpSplitString.length === 2) {
    tmpSplitString[0] += config.app_delegate_h.searchAppDelegate + ', ' + config.app_delegate_h.delegate;
  }

  chunkStr = tmpSplitString.join('');

  return chunkStr;
};

var addInterstitialShown = function(chunkStr) {

  var tmpSplitString = chunkStr.split(config.app_delegate_h.searchLastBrace);

  if (tmpSplitString.length === 2) {
    tmpSplitString[0] += config.app_delegate_h.searchLastBrace + "\n" + config.app_delegate_h.bool;
  }

  chunkStr = tmpSplitString.join('');

  return chunkStr;

};

module.exports = TransformStream;
