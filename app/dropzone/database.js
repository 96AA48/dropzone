//database.js
var fs = require('fs');
var mime = require('mime');
var Datastore = require('nedb');
var db = new Datastore(__dirname + '/dropzone/database.db');

function add(database_entry) {
  db.loadDatabase();
  var isDirectory = fs.statSync(database_entry.path).isDirectory();
  if (isDirectory) {
    database_entry.type = 'folder';
    console.log(database_entry.name, database_entry.type);
    var dirFiles = fs.readdirSync(database_entry.path);

    for (i = 0; i < dirFiles.length; i++) {
      //FIXME: Will do a weird loop when adding this project as a folder, not good for bigger folders.
        (function (i) {
          console.log(dirFiles[i]);
          var fileStat = fs.statSync(database_entry.path + '/' + dirFiles[i]);
          add({
            'lastModifiedData': fileStat.birthtime,
            'name': dirFiles[i],
            'path': database_entry.path + '/' + dirFiles[i],
            'size': fileStat.size,
            'type': (fileStat.isDirectory() ? 'folder' : mime.lookup(database_entry + '/' + dirFiles[i]))
          });
        })(i);
    }
  }

  db.update({'name': database_entry.name}, database_entry, {upsert: true}, function (err) {
    console.log('Added database_entry :', database_entry);
    if (err) console.warn('Error adding database_entry', err);
  });
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
