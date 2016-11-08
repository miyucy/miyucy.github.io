document.addEventListener('DOMContentLoaded', function () {
  var peer = new Peer({ key: 'b940b211-b187-4c52-9982-7ab24a648b20' });
  var localMediaStream = null;
  var localCanvas = document.createElement('canvas');
  var elmLocalVideo = document.getElementById('localvideo');
  var elmRemoteVideo = document.getElementById('remotevideo');
  var localMediaBuffer = [];
  var senderId = null;
  var rendererId = null;
  var receiveBuffers = {};
  var remoteMediaBuffer = [];
  var CHUNK_SIZE = 512;

  peer.on('open', function (peerId) {
    var node = document.getElementById('localpeerid');
    node.textContent = peerId;
  });

  peer.on('connection', function (dataConnection) {
    foo(dataConnection);
  });

  document.getElementById('call').addEventListener('submit', function (evt) {
    evt.preventDefault();
    foo(peer.connect(evt.currentTarget.elements.remotepeerid.value, { serialization: 'json' }));
  });

  navigator.mediaDevices.getUserMedia({ video: true }).then(function (mediaStream) {
    localMediaStream = mediaStream;
    elmLocalVideo.srcObject = localMediaStream;
    elmLocalVideo.play();
    capture();
  });

  function capture() {
    requestAnimationFrame(capture);
    shot();
  }

  function shot() {
    var videoWidth = elmLocalVideo.videoWidth;
    var videoHeight = elmLocalVideo.videoHeight;
    localCanvas.width = videoWidth;
    localCanvas.height = videoHeight;
    localCanvas.getContext('2d').drawImage(elmLocalVideo,
                                           0, 0, videoWidth, videoHeight,
                                           0, 0, videoWidth, videoHeight);
    localMediaBuffer.push(localCanvas.toDataURL('image/jpeg', 0.4));
    if (localMediaBuffer.length > 30) {
      localMediaBuffer.shift();
    }
  }

  function foo(dataConnection) {
    dataConnection.on('open', function () {
      var sender = function () {
        if (localMediaBuffer.length > 0) {
          var now = +(new Date());
          var frame = localMediaBuffer.shift();
          var chunks = [];

          for (var i = 0; frame.length > 0; i++) {
            chunks.push(frame.slice(0, CHUNK_SIZE));
            frame = frame.substring(CHUNK_SIZE);
          }

          for (var i = 0, n = chunks.length; i < n; i++) {
            dataConnection.send({ t: now, i: i, n: n, c: chunks[i] });
          }
        }

        senderId = requestAnimationFrame(sender);
      };

      var renderer = function () {
        // keep last one
        if (remoteMediaBuffer.length > 0) {
          var frame = null;
          if (remoteMediaBuffer.length === 1) {
            frame = remoteMediaBuffer[0];
          } else {
            frame = remoteMediaBuffer.shift();
          }

          elmRemoteVideo.src = frame;
        }

        rendererId = requestAnimationFrame(renderer);
      };

      sender();
      renderer();
    });

    dataConnection.on('data', function (data) {
      // receive
      // console.log('t', data.t, 'i', data.i, 'n', data.n);
      var t = data.t;

      if (!receiveBuffers[t]) {
        receiveBuffers[t] = new Array(data.n);
      }

      receiveBuffers[t][data.i] = data.c;

      // end chunk
      if (data.i + 1 === data.n) {
        remoteMediaBuffer.push(receiveBuffers[t].join(''));
        receiveBuffers[t] = undefined;
      }
    });

    dataConnection.on('close', function () {
      // stop sender
      cancelAnimationFrame(senderId);
      cancelAnimationFrame(rendererId);
    });

    dataConnection.on('error', function () {
      // stop sender
      cancelAnimationFrame(senderId);
      cancelAnimationFrame(rendererId);
    });
  }
});
