//web.js
var express = require('express');
var app = express('express');
var less = require('express-less');

//import self-written modules.
var database = require('./database');
var utils = require('./utils');
var config = require('./settings');

//setting up app specific settings
app.set('view engine', 'jade');
app.set('views', process.cwd() + '/web/views');
app.use('/less', less(process.cwd() + '/web/less'));
app.use('/js', express.static(process.cwd() + '/web/js'));

app.get('/', function (req, res) {
  database.list(function (list) {
    res.render('home', {'list': list, 'utils': utils});
  });
});

app.get('/download/:file', function (req, res, next) {
  next();
});

app.param('file', function (req, res, next, file) {
  database.get(file, function (database_entry) {
    res.sendFile(database_entry.path, {headers: {'Content-Type': 'application/octet-stream'}}, function (err) {
      if (err) console.warn(err);
    });
  });
});

module.exports = function () {app.listen(config.get().port, config.get().host);};
