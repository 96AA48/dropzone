//database.js
var Datastore = require('nedb');
var db = new Datastore(__dirname + '/dropzone/database.db');

function add(database_entry) {
  db.loadDatabase();
  console.log('Adding database_entry :', database_entry);

  db.update({'name': database_entry.name}, database_entry, {upsert: true}, function (err) {
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
