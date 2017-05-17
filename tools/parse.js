var program = require('commander'),
    templateEngine = require('../src/template/templateEngine.js');

program
  .version('0.0.1')
  .option('-t, --template [templatePath]', 'Parse a database template', 'Path to the template file')

program.parse(process.argv);

console.log('Importing %s', program.template);

templateEngine.parseFile(program.template).then(function() {
    console.log('DONE');
    process.exit(1);
}, function(err) {
    console.log(err);
    process.exit(0);
});