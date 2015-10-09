$('div.list ul > li').click(function () {
  $(this).attr('class', $(this).attr('class') == 'clicked' ? '' : 'clicked');
});

var pattern = Trianglify({
  width: window.innerWidth,
  height: window.innerHeight
});

pattern.canvas($('canvas')[0]);

function feedback(str) {
  $('#feedback span').text(str);
  $('#feedback').addClass('show');
  setTimeout(function () {
    $('#feedback').removeClass('show');
  }, 1500);
}

$(window).on('resize', function () {
  var pattern = Trianglify({
    width: window.innerWidth,
    height: window.innerHeight
  });

  pattern.canvas($('canvas')[0]);
});
