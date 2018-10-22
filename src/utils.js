import VideoElement from './lib/video-element';

export let Now = () => window.performance
  ? window.performance.now() / 1000
  : Date.now() / 1000;

export let CreateVideoElements = () => {
  let elements = document.querySelectorAll('.jsmpeg');
  for (let i = 0; i < elements.length; i++) {
    new VideoElement(elements[i]);
  }
};

export let Fill = (array, value) => {
  if (array.fill) {
    array.fill(value);
  }
  else {
    for (let i = 0; i < array.length; i++) {
      array[i] = value;
    }
  }
};

export let Base64ToArrayBuffer = (base64) => {
  const binary = window.atob(base64);
  const length = binary.length;
  let bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

