document.addEventListener("DOMContentLoaded", () => {
  const localVideo = document.getElementById("localvideo");
  const remoteVideo = document.getElementById("remotevideo");
  const peer = new Peer({ key: "97777572-ba97-47a0-80ee-7f94176805a9" });
  let localPeerId = null;
  let localMediaStream = null;
  let called = false;

  function foo(mediaConnection) {
    mediaConnection.on("error", err => {
      console.error('mediaConnection.on "error"', err);
    });

    mediaConnection.on("close", () => {
      if (called) {
        called = false;
      }
    });

    mediaConnection.on("stream", mediaStream => {
      remoteVideo.srcObject = mediaStream;
      remoteVideo.onload = () => video.play();
      remoteVideo.play();
    });
  }

  peer.on("open", peerId => {
    localPeerId = peerId;
    document.title = localPeerId;
    setInterval(() => {
      if (called) {
        return;
      }
      peer.listAllPeers(peerIds => {
        if (called) {
          return;
        }
        peerIds = peerIds.filter(peerId => localPeerId != peerId);
        if (peerIds.length > 0) {
          called = true;
          foo(peer.call(peerIds[0], localVideo.captureStream()));
        }
      });
    }, 5 * 1000);
  });

  peer.on("close", () => {
    localPeerId = null;
  });

  peer.on("error", err => {
    console.error('peer.on "error"', err);
  });

  peer.on("call", mediaConnection => {
    called = true;
    foo(mediaConnection);
    mediaConnection.answer(localVideo.captureStream());
  });
});
