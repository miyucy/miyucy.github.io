// SpeechSynthesis
// SpeechSynthesisVoice
// SpeechSynthesisUtterance

// utterance
// 発声, 口に出すこと, 発言, 話ぶり, 初和

function removeChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function buildVoiceOption(select, voices) {
  removeChildren(select);
  voices.forEach(voice => {
    const option = document.createElement("option");
    const value = `${voice.name} - ${voice.lang}`;
    option.textContent = value;
    option.value = value;
    option.dataset.name = voice.name;
    option.dataset.lang = voice.lang;
    select.appendChild(option);
    if (voice.defualt) {
      option.selected = true;
    }
  });
}

function setVoice(utterance, voices, voiceName) {
  const choices = voices.filter(voice => voice.name === voiceName);
  if (choices.length > 0) {
    utterance.voice = choices[0];
  } else {
    const defaultVoice = voices.find(voice => voice.default);
    if (defaultVoice) {
      utterance.voice = defaultVoice;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const SpeechSynthesis = window.speechSynthesis;
  const $textarea = document.querySelector("#textarea");
  const $voices = document.querySelector("#voices");
  const $form = document.querySelector("form");
  const $pitch = document.querySelector("#pitch");
  const $rate = document.querySelector("#rate");
  const $volume = document.querySelector("#volume");

  ["pitch", "rate", "volume"].forEach(name => {
    const label = document.querySelector(`label[for=${name}]`);
    label.addEventListener("click", () => {
      const input = document.querySelector(`#${name}`);
      input.value = "1";
    });
  });

  speechSynthesis.addEventListener("voiceschanged", () => {
    buildVoiceOption($voices, speechSynthesis.getVoices());
  });

  $form.addEventListener("submit", event => {
    event.preventDefault();
    const utterance = new SpeechSynthesisUtterance($textarea.value);
    setVoice(utterance, speechSynthesis.getVoices(), $voices.selectedOptions[0].dataset.name);
    utterance.pitch = $pitch.valueAsNumber;
    utterance.rate = $rate.valueAsNumber;
    utterance.volume = $volume.valueAsNumber;
    speechSynthesis.speak(utterance);
  });
});
