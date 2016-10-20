const commandLineArgs = require('command-line-args');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const jsonModifier = require('./jsonModifier');

const optionDefinitions = [
  { name: 'file', alias: 'f', type: String},
  { name: 'changeset', alias: 'c', type: String, multiple: true, defaultOption: true }
]

const options = commandLineArgs(optionDefinitions)



if(options['file'] === undefined){
    console.error('File path required')
    process.exit(1);
}

if(options['changeset'] === undefined){
    console.error('Changeset is required');
    process.exit(1);
}

fs.readFileAsync(options['file'], 'utf8').then(function(data){
    var obj = JSON.parse(data);
    for(var changeset of options['changeset']){
        var change = changeset.split('=');
        jsonModifier.modifyPropertyRecursive(obj, change[0], change[1]);
    }
    return fs.writeFileAsync(options['file'], JSON.stringify(obj));
}).then(function(result){
    console.log('All done!');
    process.exit();
}).catch(function(err){
    console.error('An error occured: ' + err);
    process.exit(1);
})