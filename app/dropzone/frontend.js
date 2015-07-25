//frontend.js
var database = require('./database');
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
  $('.container div').fadeOut('fast', function () {
    $('.container .' + event.currentTarget.className).fadeIn('fast');
  });
}
