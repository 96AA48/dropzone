//web.js
var express = require('express');
var app = express('express');
var less = require('express-less');

//import self-written modules.
var database = require('./database');

//setting up app specific settings
app.set('view engine', 'jade');
app.set('views', process.cwd() + '/web/views');
app.use('/less', less(process.cwd() + '/web/less'));

app.get('/', function (req, res) {
  database.list(function (list) {
    res.render('home', {'list': list});
  });
});

app.get('/download/:file', function (req, res, next) {
  next();
});

app.param('file', function (req, res, next, file) {
  database.get(file, function (database_entry) {
    res.sendFile(database_entry.path, null, function (err) {
      if (err) console.warn(err);
    });
  });
});

module.exports = function () {app.listen(9648);};
