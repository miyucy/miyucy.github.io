function removeChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
  const speechRecognition = new SpeechRecognition();
  const speechGrammarList = new SpeechGrammarList();
  speechRecognition.lang = "ja-JP";
  speechRecognition.continuous = true;
  speechRecognition.grammers = speechGrammarList;
  const $results = document.querySelector("#results");

  document.querySelector("#start").addEventListener("click", () => {
    speechRecognition.start();
  });

  document.querySelector("#stop").addEventListener("click", () => {
    speechRecognition.stop();
  });

  speechRecognition.addEventListener("start", (event) => {
    console.log(event);
  });
  speechRecognition.addEventListener("end", (event) => {
    console.log(event);
  });

  speechRecognition.addEventListener("audiostart", (event) => {
    console.log(event);
  });
  speechRecognition.addEventListener("audioend", (event) => {
    console.log(event);
  });

  speechRecognition.addEventListener("soundstart", (event) => {
    console.log(event);
  });
  speechRecognition.addEventListener("soundstop", (event) => {
    console.log(event);
  });

  speechRecognition.addEventListener("speechstart", (event) => {
    console.log(event);
  });
  speechRecognition.addEventListener("speechstop", (event) => {
    console.log(event);
  });

  speechRecognition.addEventListener("result", (event) => {
    console.log(event);
    removeChildren($results);
    const n = event.results.length;
    for (let i=0; i<n; i++) {
      const result = event.results[i];
      const ol = document.createElement("ol");
      const m = result.length;
      for (let j=0; j<m; j++) {
        const li = document.createElement("li");
        li.textContent = `${result[j].transcript} (${result[j].confidence})`;
        ol.appendChild(li);
      }
      $results.appendChild(ol);
    }
  });
  speechRecognition.addEventListener("nomatch", (event) => {
    console.log(event);
  });
  speechRecognition.addEventListener("error", (event) => {
    console.log(event);
  });
});
