document.addEventListener('DOMContentLoaded', function () {
  let useVideo = document.body.dataset.useVideo === '1';
  const localOverride = localStorage.getItem('useVideoBackground');
  if (localOverride !== null) {
    useVideo = localOverride === '1';
  }

  const video = document.getElementById('bgVideo');
  const crossfade = document.getElementById('CrossFade');
  const speaker = document.querySelector('.speaker');
  const sound = document.getElementById('player');
  const isMobile = /iPhone|iPad|iPod|iOS|Android/i.test(navigator.userAgent);
  let audiostatus = 'off';

  if (isMobile && useVideo) {
    video.muted = true;
    video.play().then(() => {
      video.muted = false;
      speaker.classList.add('speakerplay');
    }).catch(() => {
      video.muted = true;
      speaker.classList.remove('speakerplay');
    });
  }

  function setupVideoBackground() {
    video.src = '/luci-static/alpha/background/background.mp4';
    video.style.display = 'block';
    video.muted = false;
    crossfade.style.display = 'none';
    crossfade.innerHTML = '';

    video.play().then(() => {
      speaker.classList.toggle('speakerplay', !video.muted && !video.paused && video.volume > 0);
    }).catch(() => {
      video.muted = true;
      video.play().then(() => {
        speaker.classList.remove('speakerplay');
      });
    });

    speaker.onclick = () => {
      if (video.muted) {
        video.muted = false;
        video.volume = 1;
        video.play().catch(() => {
          video.muted = true;
          speaker.classList.remove('speakerplay');
        });
      } else {
        video.muted = true;
      }
      speaker.classList.toggle('speakerplay', !video.muted);
    };

    video.addEventListener('play', () => {
      speaker.classList.toggle('speakerplay', !video.muted && video.volume > 0);
    });

    video.addEventListener('pause', () => speaker.classList.remove('speakerplay'));
    video.addEventListener('error', setupImageBackground);
  }

  function setupImageBackground() {
    video.pause();
    video.removeAttribute('src');
    video.load();
    video.style.display = 'none';

    crossfade.style.display = 'block';
    crossfade.innerHTML = '';
    const backgrounds = ['dashboard.png', 'login.png', 'custom.png'];
    const basePath = '/luci-static/alpha/background/';
    backgrounds.forEach(filename => {
      const img = document.createElement('img');
      img.src = basePath + filename;
      img.alt = 'background';
      crossfade.appendChild(img);
    });

    sound.src = 'https://gitee.com/bauw/bauw/raw/main/media/audio.ogg';
    sound.loop = true;
    sound.autoplay = true;
    sound.muted = false;
    sound.load();

    sound.play().then(() => {
      speaker.classList.add('speakerplay');
    }).catch(() => {
      sound.muted = true;
      sound.play().catch(() => {});
      speaker.classList.remove('speakerplay');
    });

    speaker.onclick = () => {
      if (sound.paused) {
        sound.muted = false;
        sound.play().catch(() => {});
      } else {
        sound.pause();
      }
    };

    sound.addEventListener('play', () => speaker.classList.add('speakerplay'));
    sound.addEventListener('pause', () => speaker.classList.remove('speakerplay'));
  }

  if (useVideo) {
    setupVideoBackground();
  } else {
    setupImageBackground();
  }

  const loginBox = document.getElementById('loginBox');
  if (loginBox) {
    document.body.addEventListener('click', function (e) {
      if (!loginBox.contains(e.target)) {
        loginBox.classList.toggle('active');
      }
    });

    document.body.addEventListener('keydown', function (e) {
      const active = document.activeElement;
      if (!['INPUT', 'TEXTAREA'].includes(active.tagName) && !active.isContentEditable) {
        loginBox.classList.toggle('active');
      }
    });
  }

});

