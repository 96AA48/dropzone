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

module.exports = {
  'parse_size': parse_size
}
