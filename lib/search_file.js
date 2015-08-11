var fs = require('fs');
var TransformDelegateHeader = require('./transform/app_delegate/header');
var TransformDelegateImpl = require('./transform/app_delegate/implementation');
var sys = require('sys')
var exec = require('child_process').exec;

module.exports = (function() {

  var searchFile = {};

  var fileTypeValues = [
    'app_delegate_h',
    'app_delegate_m'
  ];

  searchFile.txt = function(file, fileType, opts) {

    var ts;

    if (fileTypeValues.indexOf(fileType) === -1) {
      console.log('Error occurred');
      return;
    }

    if (fileType === fileTypeValues[0]) {
      ts = new TransformDelegateHeader();
    } else if (fileType === fileTypeValues[1]) {
      ts = new TransformDelegateImpl(opts.applicationId, opts.clientKey, opts.orientation, opts.testAds, opts.frequencyCap);
    }

    var rs = fs.createReadStream(file, 'utf8');
    var ws = fs.createWriteStream(file + '.new');

    rs.pipe(ts).pipe(ws);

    ws.on('finish', function() {
      exec('mv ' + file + '.new ' + file, function(err, stdout, stderr) {

        if (!err) {
          return;
        }

      });
    });

  };

  return searchFile;
}());
