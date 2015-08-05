//frontend.js
var database = require('./database');
var utils = require('./utils');
var config = require('./settings');
var http = require('http');
var $ = require('jquery');
var gui = global.gui;
var last_list = [];

//Frontend listeners for dropping files
$('.container, .dropzone, html, body, *').on('dragover', prevent_default);
$('.container, .dropzone, html, body, *').on('dragenter', prevent_default);
$('.container .dropzone').on('drop',
  function(event) {
    prevent_default(event);

    if (event.originalEvent.dataTransfer){
      var files = event.originalEvent.dataTransfer.files;

      for (var i = 0; i < files.length; i++) {
        database.add(files[i]);
      }
    }
  }
);

//Listeners for button presses in the sidemenu
$('.sidebar ul li').click(switch_view);

function prevent_default(event) {
  event.preventDefault();
  event.stopPropagation();
}

function switch_view(event) {
  $('.container > div').fadeOut(250, function () {
    setTimeout(function () {$('.container .' + event.currentTarget.className).fadeIn(250) }, 250);
  });

  if (event.currentTarget.className == 'list') build_list();
  else if (event.currentTarget.className == 'connection') check_availablity();
  else if (event.currentTarget.className == 'open') open('http://' + config.get().host + ':' + config.get().port);
  // else
}

function build_list() {
  console.log('Building list');
  $('div.list > ul').html('');

  database.list(function (list) {
    last_list = list;
    if (list.length == 0) $('div.list > ul').append('<li>No files were dropped yet');
    for (var i = 0; i < list.length; i++) {
        $('div.list > ul').append(
          '<li>' +
          '<span>' + list[i].name + '</span>' +
          '<ul class="meta">' +
            '<li>' + (list[i].type || 'directory') + '</li>' +
            '<li>' + utils.parse_size(list[i].size) + '</li>' +
          '</ul>' +
          '<div>' +
            '<i class="material-icons open">open_in_new</i>' +
            '<i class="material-icons share">share</i>' +
            '<i class="material-icons folder">folder</i>' +
            '<i class="material-icons remove">remove_circle</i>' +
            '<i class="material-icons web">web</i>' +
          '<div>' +
          '</li>'
        );
    }

    $('div.list > ul > li').click(function () {
      $(this).attr('class', $(this).attr('class') == 'clicked' ? '' : 'clicked');
    });

    $('div.list > ul > li > div > i').click(function () {
      var index = $($(this).parents()[1]).index();
      if ($(this).text() == 'open_in_new') open(last_list[index].path);
      else if ($(this).text() == 'share') clipboard('http://' + config.get().host + ':' + config.get().port + '/download/' + last_list[index].name);
      else if ($(this).text() == 'folder') open(last_list[index].path.split(/\\|\//g).splice(0, last_list[index].path.split(/\\|\//g).length - 1).join('\/'));
      else if ($(this).text() == 'remove_circle') database.rem(last_list[index]._id);
      else if ($(this).text() == 'web') open('http://' + config.get().host + ':' + config.get().port + '/preview/' + last_list[index].name);
    });
  });
}

function check_availablity() {
  http.get('http://' + config.get().host + ':' + config.get().port, function (res) {
    var _data = '';

    res.on('data', function (data) {
      _data += data;
    });

    res.on('end', function () {
      if ((_data.match('<meta content="dropzone"/>') || []).length > 0) {
        $('.topbar i').text('cloud_done');
        $('.connection > div').attr('class', 'available');
        setTimeout(function () {$('.topbar i').text('cloud');}, 3000);
        $('.connection > div > i').text('done');
        $('.connection > span').text('Your dropzone is currently available.');
      }
      else {
        $('.topbar i').text('cloud_off');
        $('.connection > div').attr('class', 'notavailable');
        setTimeout(function () {$('.topbar i').text('cloud');}, 3000);
        $('.connection > div > i').text('clear')
        $('.connection > span').text('Your dropzone is currently not available via the set address.');
      }
    });
  });
}

function open(location) {
  gui.Shell.openExternal(location);
}

function clipboard(str) {
  gui.Clipboard.get().set(str, 'text');
}
