document.addEventListener("DOMContentLoaded", function() {
  function pickImageFile(files) {
    return new Promise(function(resolve, reject) {
      for (let i = 0, n = files.length; i < n; i++) {
        const file = files.item(i);
        if (file.type.startsWith("image/")) {
          resolve(file);
          return;
        }
      }
      reject();
    });
  }

  function readFileAsDataURL(file) {
    return new Promise(function(resolve, reject) {
      if (file) {
        const fileReader = new FileReader();
        fileReader.onload = function(evt) {
          resolve(evt.currentTarget.result);
        };
        fileReader.readAsDataURL(file);
      } else {
        reject();
      }
    });
  }

  function convertToBlob(dataURI) {
    return new Promise(function(resolve, reject) {
      const img = document.createElement("img");
      img.onload = function(evt) {
        const currentTarget = evt.currentTarget;
        const srcWidth = evt.currentTarget.width;
        const srcHeight = evt.currentTarget.height;
        const destWidth = srcWidth * 2;
        const destHeight = srcHeight * 2;
        const canvas = document.createElement("canvas");
        canvas.width = destWidth;
        canvas.height = destHeight;
        canvas.getContext("2d").drawImage(img, 0, 0, srcWidth, srcHeight, 0, 0, destWidth, destHeight);
        canvas.toBlob(function (blob) {
          resolve(blob);
        });
      };
      img.src = dataURI;
    });
  }

  function downloadBlob(blob) {
    return new Promise(function(resolve, reject) {
      const anchor = document.createElement("a");
      anchor.href = URL.createObjectURL(blob);
      anchor.download = "blob.png";
      anchor.click();
    });
  }

  document.getElementById("file").addEventListener("change", function(evt) {
    pickImageFile(evt.currentTarget.files).then(readFileAsDataURL).then(convertToBlob).then(downloadBlob).catch(console.error);
  });
});
