//database.js
var fs = require('fs');
var Datastore = require('nedb');
var db = new Datastore(global.gui.App.dataPath + '/database.db');
var mime = require('mime');
var folderindex = require('recursive-files');

function add(database_entry) {
  db.loadDatabase();

  if (fs.statSync(database_entry.path).isDirectory()) {
    console.log('It\'s a directory');
    folderindex(database_entry.path, {'hidden': true}, function (err, file) {
      var entry = getMetaData(file);
      db.update({'name': entry.name}, entry, {'upsert': true}, function (err) {
        if (err) console.warn('Error adding directory file', err);
        console.log('Added directory file :', database_entry)
      })
    });
  }
  else {
    var entry = getMetaData(database_entry.path);
    db.update({'name': entry.name}, entry, {upsert: true}, function (err) {
      if (err) console.warn('Error adding file', err);
      console.log('Added file :', entry);
    });
  }
}

function getMetaData(filepath) {
  console.log(filepath);
  var stats = fs.statSync(filepath);
  return {
    lastModified: stats.atime,
    size: stats.size,
    path: filepath,
    name: filepath.split(/\/|\\/g)[filepath.split(/\/|\\/g).length - 1],
    type: mime.lookup(filepath)
  };
}

function list(callback) {
  db.loadDatabase();
  console.log('Getting database_list');

  db.find({}, function (err, database_list) {
    if (err) console.warn('Error getting database_list', err);
    else callback(database_list);
  });
}

function get(query, callback) {
  db.loadDatabase();
  console.log('Getting a database_entry with', query);

  db.findOne({name: query}, function (err, database_entry) {
    if (err) console.warn('Error getting database_entry', err);
    else callback(database_entry);
  });
}

function rem(id) {
  console.log('Removing document with ', id);
  if (typeof id == 'string') db.remove({_id: id});
  else {
    for (i = 0; i < id.length; i++) {
      db.remove({_id: id[i]._id});
    }
  }
}

module.exports = {'add': add, 'list': list, 'get': get, 'rem': rem};
