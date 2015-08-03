var program = require('commander');

program
  .version('1.0.0')
  .usage('<applicationId> <clientKey>')
  .parse(process.argv);

if (program.args.length !== 2) {
  program.help();
} else {
  var applicationId = program.args[0];
  var clientKey = program.args[1];

  console.log('App ID ' + applicationId);
  console.log('Client Key ' + clientKey);
}

