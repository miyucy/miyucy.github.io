document.addEventListener('DOMContentLoaded', function () {
  var peer = new Peer({ key: 'b940b211-b187-4c52-9982-7ab24a648b20' });
  var mediaStream = new MediaStream();
  var flags = { video: false, audio: false };

  peer.on('open', function (peerId) {
    var node = document.getElementById('localpeerid');
    node.textContent = peerId;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(function (localMediaStream) {
      updateTracks(localMediaStream, flags);
      updateButtons(flags);
      copyTracks(localMediaStream, mediaStream);
      play(document.getElementById('localvideo'), mediaStream);
    }).catch(console.error);
  });

  peer.on('call', function (mediaConnection) {
    mediaConnection.on('error', console.error);
    mediaConnection.on('stream', function (mediaStream) {
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

  document.getElementById('video').addEventListener('click', function (evt) {
    flags.video = !flags.video;
    updateTracks(mediaStream, flags);
    updateButtons(flags);
  });

  document.getElementById('audio').addEventListener('click', function (evt) {
    flags.audio = !flags.audio;
    updateTracks(mediaStream, flags);
    updateButtons(flags);
  });
});

function updateButtons(flags) {
  document.getElementById('video').textContent = 'video ' + (flags.video ? 'off' : 'on');
  document.getElementById('audio').textContent = 'audio ' + (flags.audio ? 'off' : 'on');
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
