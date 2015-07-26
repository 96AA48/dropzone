//frontend.js
var database = require('./database');
var utils = require('./utils');
var $ = require('jquery');

//Frontend listeners for dropping files
$('.container .dropzone, html, body').on('dragover', prevent_default);
$('.container .dropzone, html, body').on('dragenter', prevent_default);
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
  $('.container div').fadeOut(250, function () {
    setTimeout(function () {$('.container .' + event.currentTarget.className).fadeIn(250) }, 250);
  });

  if (event.currentTarget.className == 'list') build_list();
  // else
}

function build_list() {
  console.log('Building list');
  database.list(function (list) {
    for (var i = 0; i < list.length; i++) {
      console.log(i);
      (function (i) {
        $('div.list > ul').append(
          '<li>' +
          '<span>' + list[i].name + '</span>' +
          '<ul class="meta">' +
            '<li>' + list[i].type || 'directory' + '</li>' +
            '<li>' + utils.parse_size(list[i].size) + '</li>' +
          '</ul>' +
          '<div>' +
            '<i class="material-icons share">share</i>' +
            '<i class="material-icons share">folder</i>' +
            // '<i class="material-icons share">share</i>' +
            // '<i class="material-icons share">share</i>' +
          '<div>' +
          '</li>'
        );
      }(i))
    }
  });
}
