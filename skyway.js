document.addEventListener('DOMContentLoaded', function () {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(function (mediaStream) {
    var flags = { video: false, audio: false };
    var peer = new Peer({ key: 'b940b211-b187-4c52-9982-7ab24a648b20' });

    updateButtons(flags);
    for (var track of mediaStream.getTracks()) {
      track.enabled = false;
    }

    peer.on('open', function (peerId) {
      var node = document.getElementById('localpeerid');
      node.textContent = peerId;
    });

    peer.on('call', function (mediaConnection) {
      mediaConnection.answer(mediaStream);
      mediaConnection.on('stream', function (mediaStream) {
        play(document.getElementById('remotevideo'), mediaStream);
      });
    });

    play(document.getElementById('localvideo'), mediaStream);

    document.getElementById('call').addEventListener('submit', function (evt) {
      evt.preventDefault();
      var mediaConnection = peer.call(evt.currentTarget.elements.remotepeerid.value, mediaStream);
      mediaConnection.on('stream', function (mediaStream) {
        play(document.getElementById('remotevideo'), mediaStream);
      });
    });

    document.getElementById('video').addEventListener('click', function (evt) {
      flags.video = !flags.video;
      updateButtons(flags);
      for (var track of mediaStream.getVideoTracks()) {
        track.enabled = flags.video;
      }
    });

    document.getElementById('audio').addEventListener('click', function (evt) {
      flags.audio = !flags.audio;
      updateButtons(flags);
      for (var track of mediaStream.getAudioTracks()) {
        track.enabled = flags.audio;
      }
    });
  }).catch(console.error);
});

function updateButtons(flags) {
  document.getElementById('video').textContent = 'video ' + (flags.video ? 'off' : 'on');
  document.getElementById('audio').textContent = 'audio ' + (flags.audio ? 'off' : 'on');
}

function play(node, mediaStream) {
  node.srcObject = mediaStream;

  var callback = function () {
    node.play();
    node.removeEventListener('loadedmetadata', callback);
  };

  node.addEventListener('loadedmetadata', callback, false);
}
