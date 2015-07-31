$('ul.list > li').click(function () {
  $(this).attr('class', $(this).attr('class') == 'clicked' ? '' : 'clicked');
});
