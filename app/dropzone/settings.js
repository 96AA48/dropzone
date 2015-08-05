//settings.js
var fs = require('fs');

function get(setting) {
  console.log('Getting setting', setting || 'all')
  if (!fs.existsSync(__dirname + '/settings.json')) first_run();
  var settings = JSON.parse(fs.readFileSync(__dirname + '/settings.json'));
  if (setting) return settings[setting];
  else return settings;
}

function set(setting, value) {
  console.log('Setting setting', setting, 'with', value);
  if (!fs.existsSync(__dirname + '/settings.json')) first_run();
  var settings = JSON.parse(fs.readFileSync(__dirname + '/settings.json'));
  settings[setting] = value;
  fs.writeFileSync(__dirname + '/settings.json', JSON.stringify(settings, null, 2));
}

function first_run() {
  console.log('Doing settings first_run');
  var settings = {
    host: null,
    port: 1024
  };

  fs.writeFileSync(__dirname + '/settings.json', JSON.stringify(settings, null, 2));
}

module.exports = {
  'set': set,
  'get': get
}
