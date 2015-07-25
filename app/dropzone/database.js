//database.js
var Datastore = require('nedb');
var db = new Datastore(process.cwd() + '/dropzone/database.db');

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

module.exports = {'add': add, 'list': list};
