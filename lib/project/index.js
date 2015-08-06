var fs = require('fs');
var xcode = require('xcode');
var proj;
var projPath;

var Project = function(projectPath) {

  projPath = projectPath;
  proj = xcode.project(projPath);

};

Project.prototype.edit = function(cb) {

  // parsing is async, in a different process
  proj.parse(function (err) {

    proj.addFramework('./tapdaq-ios-sdk-master/Tapdaq.framework', { customFramework: true });

    proj.addFramework('Foundation.framework');
    proj.addFramework('UIKit.framework');
    proj.addFramework('QuartzCore.framework');
    proj.addFramework('AdSupport.framework');

    proj.addResourceFile('../tapdaq-ios-sdk-master/TapdaqResources.bundle');
    proj.removeFromLibrarySearchPaths('"\$\(SRCROOT\)/tapdaq-ios-sdk-master"');
    proj.addToLibrarySearchPaths('"tapdaq-ios-sdk-master"');

    fs.writeFileSync(projPath, proj.writeSync());

    cb(null);

  });

};

module.exports = Project;