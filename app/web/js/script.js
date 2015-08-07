$('div.list ul > li').click(function () {
  $(this).attr('class', $(this).attr('class') == 'clicked' ? '' : 'clicked');
});

var pattern = Trianglify({
  width: window.innerWidth,
  height: window.innerHeight
});

pattern.canvas($('canvas')[0]);
