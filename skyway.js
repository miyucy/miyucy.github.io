document.addEventListener('DOMContentLoaded', function () {
  var peer = new Peer({ key: 'b940b211-b187-4c52-9982-7ab24a648b20' });
  var mediaStream = new MediaStream();
  var flags = { video: false, audio: false };

  peer.on('open', function (peerId) {
    var node = document.getElementById('localpeerid');
    node.textContent = peerId;
  });

  peer.on('call', function (mediaConnection) {
    mediaConnection.on('error', console.error);
    mediaConnection.on('stream', function (mediaStream) {
      mediaStream.addEventListener('addtrack', console.log);
      mediaStream.addEventListener('removetrack', console.log);
      play(document.getElementById('remotevideo'), mediaStream);
    });

    mediaConnection.answer(mediaStream);
  });

  peer.on('error', console.error);

  document.getElementById('call').addEventListener('submit', function (evt) {
    evt.preventDefault();
    var mediaConnection = peer.call(evt.currentTarget.elements.remotepeerid.value, mediaStream);
    mediaConnection.on('error', console.error);
    mediaConnection.on('stream', function (mediaStream) {
      play(document.getElementById('remotevideo'), mediaStream);
    });
  });

  document.getElementById('video').addEventListener('change', getUserMedia);
  document.getElementById('enablevideo').addEventListener('change', function (evt) {
    flags.video = evt.currentTarget.checked;
    updateTracks(mediaStream, flags);
  });

  document.getElementById('audio').addEventListener('change', getUserMedia);
  document.getElementById('enableaudio').addEventListener('change', function (evt) {
    flags.audio = evt.currentTarget.checked;
    updateTracks(mediaStream, flags);
  });

  navigator.mediaDevices.addEventListener('devicechange', enumerateDevices);
  enumerateDevices();
  getUserMedia();

  function getUserMedia() {
    navigator.mediaDevices.getUserMedia(getConstraints()).then(function (localMediaStream) {
      updateTracks(localMediaStream, flags);
      copyTracks(localMediaStream, mediaStream);
      play(document.getElementById('localvideo'), mediaStream);
    });
  }

  function getConstraints() {
    var constraints = { video: true, audio: true };

    var video = document.getElementById('video');
    if (video.value && video.value.length > 0) {
      constraints.video = { deviceId: { exact: video.value } };
    }

    var audio = document.getElementById('audio');
    if (audio.value && audio.value.length > 0) {
      constraints.audio = { deviceId: { exact: audio.value } };
    }

    return constraints;
  }

  function enumerateDevices() {
    navigator.mediaDevices.enumerateDevices().then(function (devices) {

      var video = document.getElementById('video');
      removeChildren(video);
      devices.filter(function (device) {
        return device.kind === 'videoinput';
      }).forEach(function (device) {
        var option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label;
        video.appendChild(option);
      });

      var audio = document.getElementById('audio');
      removeChildren(audio);
      devices.filter(function (device) {
        return device.kind === 'audioinput';
      }).forEach(function (device) {
        var option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label;
        audio.appendChild(option);
      });

    }).catch(console.error);
  }

  function updateTracks(mediaStream, flags) {
    for (var track of mediaStream.getVideoTracks()) {
      track.enabled = flags.video;
    }

    for (var track of mediaStream.getAudioTracks()) {
      track.enabled = flags.audio;
    }
  }

  function copyTracks(src, dest) {
    for (var track of dest.getTracks()) {
      dest.removeTrack(track);
    }

    for (var track of src.getTracks()) {
      dest.addTrack(track);
    }
  }

  function play(node, mediaStream) {
    node.srcObject = mediaStream;
    node.play();

    var callback = function () {
      node.play();
      node.removeEventListener('loadedmetadata', callback);
    };

    node.addEventListener('loadedmetadata', callback, false);
  }

  function removeChildren(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }
});
