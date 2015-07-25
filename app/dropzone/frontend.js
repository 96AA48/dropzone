//frontend.js
var database = require('./database');
var $ = require('jquery');

$('.container .dropzone, html, body').on('dragover',
  function(event) {
    event.preventDefault();
    event.stopPropagation();
  }
);

$('.container .dropzone, html, body').on('dragenter',
  function(event) {
    event.preventDefault();
    event.stopPropagation();
  }
);

$('.container .dropzone').on('drop',
  function(event) {
    event.preventDefault();
    event.stopPropagation();

    if (event.originalEvent.dataTransfer){
      var files = event.originalEvent.dataTransfer.files;

      for (var i = 0; i < files.length; i++) {
        database.add(files[i]);
      }
    }
  }
);
