document.addEventListener('luci-loaded', function(ev) {
  var getaudio = $('#player')[0];
  var audiostatus = 'off';

  $(document).on('click touchend', '.speaker', function() {
    if (!$('.speaker').hasClass("speakerplay")) {
      if (audiostatus == 'off') {
        $('.speaker').addClass('speakerplay');
        getaudio.load();
        getaudio.play();
        audiostatus = 'on';
        return false;
      } else if (audiostatus == 'on') {
        $('.speaker').addClass('speakerplay');
        getaudio.play();
      }
    } else if ($('.speaker').hasClass("speakerplay")) {
      getaudio.pause();
      $('.speaker').removeClass('speakerplay');
      audiostatus = 'on';
    }
  });

  $('#player').on('ended', function() {
    $('.speaker').removeClass('speakerplay');
    audiostatus = 'off';
  });
});

