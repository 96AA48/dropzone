//web.js
var express = require('express');
var app = express('express');
var less = require('express-less');
var fs = require('fs');

//import self-written modules.
var database = require('./database');
var utils = require('./utils');
var config = require('./settings');

//setting up app specific settings
app.set('view engine', 'jade');
app.set('views', process.cwd() + '/web/views');
app.use('/less', less(process.cwd() + '/web/less', {debug: true}));
app.use('/js', express.static(process.cwd() + '/web/js'));

app.get('/', function (req, res) {
  database.list(function (list) {
    res.render('home', {'list': list, 'utils': utils});
  });
});

app.get('/download/:download_file', function (req, res, next) {
  next();
});

app.param('download_file', function (req, res, next, download_file) {
  database.get(download_file, function (database_entry) {
    res.sendFile(database_entry.path, {headers: {'Content-Type': 'application/octet-stream'}}, function (err) {
      if (err) console.warn(err);
    });
  });
});

app.get('/preview/:preview_file', function (req, res, next) {
    next();
});

app.param('preview_file', function (req, res, next, preview_file) {
  database.get(preview_file, function (database_entry) {
    var content = database_entry.type.match(/video|audio/g) == 0 ? fs.readFileSync(database_entry.path) : '';
    res.render('preview', {'file': database_entry, 'content': content, 'utils': utils});
  });
});

module.exports = function () {app.listen(config.get().port, config.get().host);};
