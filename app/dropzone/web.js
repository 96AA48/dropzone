//web.js
var express = require('express');
var app = express('express');
var less = require('express-less');
var fs = require('fs');
var $ = require('jquery');

//import self-written modules.
var database = require('./database');
var utils = require('./utils');
var config = require('./settings');

//setting up app specific settings
app.set('view engine', 'jade');
app.set('views', process.cwd() + '/web/views');
app.use('/less', less(process.cwd() + '/web/less', {debug: true}));
app.use('/js', express.static(process.cwd() + '/web/js'));
app.disable('view cache');

app.get('/', function (req, res) {
  ping('connect');
  database.list(function (list) {
    res.render('home', {'list': list, 'utils': utils});
  });
});

app.get('/download/:download_file', function (req, res, next) {
  next();
});

app.param('download_file', function (req, res, next, download_file) {
  ping('download');
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
  ping('preview');
  database.get(preview_file, function (database_entry) {
    var content = (!database_entry.type.match(/video|audio/g) && !utils.ignore_file(database_entry.name, database_entry.type)) ? fs.readFileSync(database_entry.path) : '';
    res.render('preview', {'file': database_entry, 'content': content, 'utils': utils});
  });
});

function ping(type) {
  var ping = 'ping';
  switch(type) {
    case 'connect':
      ping += ' connect';
    break;

    case 'preview':
      ping += ' preview';
    break;

    case 'download':
      ping += ' download';
    break;
  }

  $('.cloud').toggleClass(ping);

  setTimeout(function () {
    $('.cloud').toggleClass(ping);
  }, 250);
}

function feedback(str) {
  $('#feedback span').text(str);
  $('#feedback').addClass('show');
  setTimeout(function () {
    $('#feedback').removeClass('show');
  }, 1500);
}

module.exports = function () {app.listen(config.get().port, config.get().use_custom_host ? config.get().host : null);};
