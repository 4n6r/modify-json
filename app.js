'use strict';

const commandLineArgs = require('command-line-args');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

module.exports = modifyJson;

function modifyJson(filename, changeset) {
  this.filename = filename;
  this.changeset = changeset;
}

modifyJson.prototype.modifyProperty = function (obj, propName, val) {
  return new Promise(function (resolve, reject) {
    if (obj !== undefined && typeof obj === "object") {
      if (obj[propName] !== undefined && typeof obj[propName] !== "object") {
        obj[propName] = val;
        resolve();
      }
    }
  })
}

modifyJson.prototype.modifyChildProperty = function (obj, propNames, val) {
  let that = this;
  return new Promise(function (resolve, reject) {
    if (propNames.length === 1) {
      that.modifyProperty(obj, propNames[0], val).then(function(){
        resolve();
      })
    } else {
      var subItem = propNames.shift()
      that.modifyChildProperty(obj[subItem], propNames, val).then(function(){
        resolve();
      })
    }
  });
}

modifyJson.prototype.modifyPropertyRecursive = function (obj, propNames, val) {
  let that = this;
  return new Promise(function(resolve, reject){
    that.modifyChildProperty(obj, propNames.split("."), val).then(function(){
      resolve(obj);
    });
  });
}

modifyJson.prototype.modify = function (callback) {
  let that = this;
  fs.readFileAsync(this.filename, 'utf8').then(function (data) {
    let obj = JSON.parse(data);
    let promises = [];
    for (let changeset of that.changeset) {
      var change = changeset.split('=');;
      promises.push(that.modifyPropertyRecursive(obj, change[0], change[1]));
    }
    return Promise.all(promises);
  }).then(function (obj) {
    return fs.writeFileAsync(that.filename, JSON.stringify(obj))
  }).then(function(){
    callback(false);
  }).catch(function(){
    callback(true);
  });
}