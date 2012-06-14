
$.getJSON('https://api.github.com/events?callback=?', function(data) {
  var items = [];

  $.each(data, function(key, val) {
    items.push('<li id="' + key + '">' + val + '</li>');
  });

  $('<ul/>', {
    'class': 'main-content',
    html: items.join('')
  }).appendTo('body');
});

