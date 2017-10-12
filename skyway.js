function getUserMedia() {
  navigator.mediaDevices
    .getUserMedia(getConstraints())
    .then(localMediaStream => {
      play(document.getElementById("localvideo"), localMediaStream);
    })
    .catch(console.error);
}

function getConstraints() {
  var constraints = {
    video: document.getElementById("enablevideo").checked,
    audio: document.getElementById("enableaudio").checked
  };

  if (constraints.video) {
    var video = document.getElementById("video");
    if (video.value && video.value.length > 0) {
      constraints.video = { deviceId: { exact: video.value } };
    }
  }

  if (constraints.audio) {
    var audio = document.getElementById("audio");
    if (audio.value && audio.value.length > 0) {
      constraints.audio = { deviceId: { exact: audio.value } };
    }
  }

  return constraints;
}

function enumerateDevices() {
  navigator.mediaDevices
    .enumerateDevices()
    .then(devices => {
      createVideoOptions(devices);
      createAudioOptions(devices);
    })
    .catch(console.error);
}

function createAudioOptions(devices) {
  var audio = document.getElementById("audio");
  removeChildren(audio);
  devices.filter(device => device.kind === "audioinput").forEach(device => {
    var option = document.createElement("option");
    option.value = device.deviceId;
    option.text = device.label;
    audio.appendChild(option);
  });
}

function createVideoOptions(devices) {
  var video = document.getElementById("video");
  removeChildren(video);
  devices.filter(device => device.kind === "videoinput").forEach(device => {
    var option = document.createElement("option");
    option.value = device.deviceId;
    option.text = device.label;
    video.appendChild(option);
  });
}

function removeChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function play(node, mediaStream) {
  node.pause();
  if (node.srcObject) {
    node.srcObject.getTracks().forEach(track => track.stop());
  }
  node.srcObject = mediaStream;
  node.play();

  var callback = function() {
    node.play();
    node.removeEventListener("loadedmetadata", callback);
  };

  node.addEventListener("loadedmetadata", callback);
}

function startStats(mediaConnection) {
  console.log(mediaConnection);
  return setInterval(() => {
    var peerConnection = mediaConnection._negotiator._pc;
    peerConnection
      .getStats()
      .then(stats => Array.from(stats.entries()).reduce((result, entry) => ((result[entry[0]] = entry[1]), result), {}))
      .then(stats => {
        console.log((new Date()), JSON.stringify(stats));
      });
  }, 1000);
}

function cancelStats(mediaConnection, timer) {
  console.log(mediaConnection);
  clearInterval(timer);
}

function prepareMediaConnectionEventHandler(mediaConnection) {
  var timer = startStats(mediaConnection);
  mediaConnection.on("close", cancelStats.bind(null, mediaConnection, timer));
  mediaConnection.on("error", console.error);
  mediaConnection.on("stream", mediaStream => {
    play(document.getElementById("remotevideo"), mediaStream);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  var peer = new Peer({ key: "3feb3969-6383-4763-a68d-ea2a1c4dbc14" });

  peer.on("open", peerId => {
    var node = document.getElementById("localpeerid");
    node.textContent = peerId;
  });

  peer.on("error", console.error);

  peer.on("call", mediaConnection => {
    prepareMediaConnectionEventHandler(mediaConnection);
    mediaConnection.answer(document.getElementById("localvideo").srcObject);
  });

  document.getElementById("call").addEventListener("submit", evt => {
    evt.preventDefault();
    var mediaConnection = peer.call(
      evt.currentTarget.elements.remotepeerid.value,
      document.getElementById("localvideo").srcObject
    );
    prepareMediaConnectionEventHandler(mediaConnection);
  });

  navigator.mediaDevices.addEventListener("devicechange", enumerateDevices);
  document.getElementById("video").addEventListener("change", getUserMedia);
  document.getElementById("enablevideo").addEventListener("change", getUserMedia);
  document.getElementById("audio").addEventListener("change", getUserMedia);
  document.getElementById("enableaudio").addEventListener("change", getUserMedia);
  enumerateDevices();
  getUserMedia();

  window.peer = peer;
});
