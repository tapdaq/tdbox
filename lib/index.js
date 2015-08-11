#!/usr/bin/env node

var request = require('request');
var readline = require('readline');
var chalk = require('chalk');
var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;
var Xcode = require('./project');


var searchFile = require('./search_file');

var sdkZip = 'https://github.com/tapdaq/tapdaq-ios-sdk/archive/master.zip';
var sdkFolder = 'tapdaq-ios-sdk-master';
var sdkFilename = sdkFolder + '.zip';

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var applicationId;
var clientKey;
var orientation = 'both';
var testAds = false;
var frequencyCap = 0;

console.log(chalk.dim('--\ntdbox - Integrate Tapdaq to Buildbox\n--\n'));

console.log('To integrate Tapdaq, you will need to obtain an\n' + 
            'Application ID and Client Key. Please signup to\n' + 
            'https://tapdaq.com and add your iOS application.\n');

console.log('Make sure you are inside the project directory.\n');

var getApplicationId = function() {
  rl.question('Application ID?\n ', function(answer) {
    if (!answer || answer.length === 0) {
      console.log(chalk.bgRed('\nApplication ID is not valid!'));
      getApplicationId();
    } else {
      applicationId = answer;
      getClientKey();
    }
  });
};

var getClientKey = function() {

  rl.question('\nClient Key?\n ', function(answer) {

    if (!answer || answer.length === 0) {
      console.log(chalk.bgRed('\nClient Key is not valid!'));
      getClientKey();
    } else {
      clientKey = answer;
      getOrientation();
    }

  });

};

var getOrientation = function() {

  rl.question('\nOrientation? ' + chalk.dim('<portrait, landscape, both> - defaults to both') + '\n ', function(answer) {

    if (answer && answer !== 'portrait' && answer !== 'landscape') {
      console.log(chalk.bgRed('\nOrientation is not valid!'));
      getOrientation();
    } else {

      if (answer) {
        orientation = answer;
      }
      getTestMode();

    }

  });

};

var getTestMode = function() {

  rl.question('\nDo you want test ads enabled? ' + chalk.dim('<yes, no> - defaults to no') + '\n ', function(answer) {

    if (answer && answer !== 'yes' && answer !== 'no') {
      console.log(chalk.bgRed('\nValue given is not valid!'));
      getTestMode();
    } else {

      if (answer) {
        testAds = (answer === 'yes') ? true : false;
      }
      getFrequencyCap();

    }

  });

};

var getFrequencyCap = function() {

  rl.question('\nWhat should the frequency cap be? ' + chalk.dim('- defaults to 0, which turns off frequency capping') + '\n ', function(answer) {

    answer = parseInt(answer);

    if (answer === NaN) {
      console.log(chalk.bgRed('\nFrequency cap given is not a number!'));
      getFrequencyCap();
    } else {

      if (answer) {
        frequencyCap = answer;
      }

      getSDK();

    }

  });

};


var getSDK = function() {

  console.log(chalk.gray('\n- Downloading Tapdaq iOS SDK zip..'));

  request
    .get(sdkZip)
    .pipe(fs.createWriteStream(sdkFilename).on('finish', function() {

      console.log(chalk.green('- Downloaded SDK (' + sdkFilename + ')\n'));
      unzipSDK();

    }));

};

var unzipSDK = function() {

  exec('rm -rf ' + sdkFolder, function(err, stdout, stderr) {

    console.log(chalk.gray('\n- Unzipping ' + sdkFilename + ' to ' + sdkFolder + '/'));
    exec('unzip ./' + sdkFilename, function(err, stdout, stderr) {
      console.log(chalk.green('- Completed unzipping SDK'));
      exec('rm ' + sdkFilename);
      exec('mv ./' + sdkFilename + ' ./lib/ads/' + sdkFilename);
      readFile();
    });

  });

};

var readFile = function() {

  searchFile.txt('./AppController.h', 'app_delegate_h', {});
  searchFile.txt('./AppController.mm', 'app_delegate_m', {
    applicationId: applicationId,
    clientKey: clientKey,
    orientation: orientation,
    testAds: testAds,
    frequencyCap: frequencyCap
  });

  var project = new Xcode('./PTPlayer.xcodeProj/project.pbxproj');

  project.edit(function() {
    console.log(chalk.dim('\n--\n\n') + chalk.green('Integration complete! Open your project and run your application.\n'));
    exec('open PTPlayer.xcodeproj');
    process.exit(0);
  });

};

getApplicationId();
