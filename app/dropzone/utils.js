//utils.js
function parse_size(size) {
  var sizes = ['B','kB', 'MB', 'GB', 'TB'];
  var times_devided = 0;

  while (size > 1000) {
    times_devided++;
    size = size / 1000;
  }

  if (size.toString().split('.')[0].length == 1) size = Math.floor(size * 100) / 100;
  else size = Math.floor(size);

  return size + ' ' + sizes[times_devided || 0];
}

function ignore_file(name, type) {
  //Will add more files to this list as the application is hosting more types of files
  var ignored_extensions = [
    'iso',
    'bin'
  ];

  var ignored_types = [

  ];

  if (name) {
    var extension = name.split('.')[name.split('.').length - 1];
    for (i = 0; i < ignored_extensions.length; i++) {
      if (ignored_extensions[i] == extension) return true;
    }
  }

  if (type) {
    for (i = 0; i < ignored_types.length; i++) {
      if (ignored_types[i] == type) return true;
    }
  }

  return false;
}

module.exports = {
  'parse_size': parse_size,
  'ignore_file': ignore_file
}
