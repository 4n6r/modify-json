'use strict';

require('colors');

const program = require('commander');
const assert = require('assert');

var modifyJson = require('./app.js');

function list(val) {
  return val.split(',');
}

program
  .version('0.0.2')
  .usage('--file <file> --changeset <changeset>')
  .usage('-f -c <changeset>')
  .option('-f, --file <filename>', 'The JSON file location')
  .option('-c, --changeset <value>', 'The changeset', list)
  .parse(process.argv);

  assert(program.file, 'Missing required file location'.red);
  assert(program.changeset, 'Missing the required changeset options'.red);

new modifyJson(program.file, program.changeset).modify(function(err){
    process.exit(err ? 1 : 0);
});
