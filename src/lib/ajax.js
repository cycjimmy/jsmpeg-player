/* eslint class-methods-use-this: ["error", { "exceptMethods": ["resume"] }] */
export default class AjaxSource {
  constructor(url, options) {
    this.url = url;
    this.destination = null;
    this.request = null;
    this.streaming = false;

    this.completed = false;
    this.established = false;
    this.progress = 0;

    this.onEstablishedCallback = options.onSourceEstablished;
    this.onCompletedCallback = options.onSourceCompleted;

    if (options.hookOnEstablished) {
      this.hookOnEstablished = options.hookOnEstablished;
    }
  }

  connect(destination) {
    this.destination = destination;
  }

  start() {
    this.request = new XMLHttpRequest();

    this.request.onreadystatechange = function() {
      if (this.request.readyState === this.request.DONE && this.request.status === 200) {
        this.onLoad(this.request.response);
      }
    }.bind(this);

    this.request.onprogress = this.onProgress.bind(this);
    this.request.open('GET', this.url);
    this.request.responseType = 'arraybuffer';
    this.request.send();
  }

  resume(secondsHeadroom) {
    // Nothing to do here
  }

  destroy() {
    this.request.abort();
  }

  onProgress(ev) {
    this.progress = ev.loaded / ev.total;
  }

  onLoad(data) {
    this.established = true;
    this.completed = true;
    this.progress = 1;

    if (this.hookOnEstablished) {
      this.hookOnEstablished();
    }

    if (this.onEstablishedCallback) {
      this.onEstablishedCallback(this);
    }
    if (this.onCompletedCallback) {
      this.onCompletedCallback(this);
    }

    if (this.destination) {
      this.destination.write(data);
    }
  }
}
