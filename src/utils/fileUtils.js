
export function downloadTextfile(filename, text) {
  downloadFile(filename, 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
}

export function downloadImagefile(filename, imageUrl) {
  downloadFile(filename, imageUrl);
}

export function downloadFile(filename, src) {
  var element = document.createElement('a');
  element.setAttribute('href', src);
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}


export function readTextFile(file){
  return new Promise((resolve, reject) => {
    var fr = new FileReader();  
    fr.onload = () => {
      resolve(fr.result )
    };
    fr.readAsText(file);
  });
}

export function readAudioFile(file, audioContext){
  return new Promise((resolve, reject) => {
    var fr = new FileReader();  
    fr.onload = () => {
      audioContext.decodeAudioData(fr.result)
        .then ((decodedAudio) => resolve(decodedAudio));
    };
    fr.readAsArrayBuffer(file);
  });
}


export function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  var dataURL = canvas.toDataURL("image/png");

  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}