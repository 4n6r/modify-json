const commandLineArgs = require('command-line-args');
const Promise = require('bluebird');
var fs = require('fs');
const fsAsync = Promise.promisifyAll(fs);

const optionDefinitions = [
  { name: 'file', alias: 'f', type: String},
  { name: 'options', alias: 'o', type: String, multiple: true, defaultOption: true }
]

const options = commandLineArgs(optionDefinitions)

fsAsync.readFileAsync(options['file'], 'utf8').then(function(data){
    var obj = JSON.parse(data);
    for(var option of options['options']){
        console.log(option);
        var test = option.split('=');
        obj[test[0]] = test[1];
    }
    return fsAsync.writeFileAsync(options['file'], JSON.stringify(obj));
}).then(function(result){
    console.log('All done!');
})