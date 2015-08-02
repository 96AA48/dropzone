//settings.js
var Datastore = require('nedb');
var db = new Datastore(__dirname + '/dropzone/settings.db');

function set(setting) {
  db.loadDatabase();
  console.log('Setting settings:', setting);

  db.update({'setting': setting}, setting, {upsert: true}, function (err) {
    if (err) console.warn('Error adding setting', err);
  });
}

function list(callback) {
  db.loadDatabase();
  console.log('Getting all settings');

  db.find({}, function (err, settings) {
    if (err) console.warn('Error getting settings', err);
    else callback(settings);
  });
}

function get(query, callback) {
  db.loadDatabase();
  console.log('Getting a setting with', query);

  db.findOne({name: query}, function (err, setting) {
    if (err) console.warn('Error getting setting', err);
    else callback(setting);
  });
}

module.exports = {'set': set, 'list': list, 'get': get};
