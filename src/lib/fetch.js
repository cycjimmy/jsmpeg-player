/* eslint class-methods-use-this: ["error", { "exceptMethods": ["resume"] }] */
export default class FetchSource {
  constructor(url, options) {
    this.url = url;
    this.destination = null;
    this.request = null;
    this.streaming = true;

    this.completed = false;
    this.established = false;
    this.progress = 0;
    this.aborted = false;

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
    const params = {
      method: 'GET',
      headers: new Headers(),
      cache: 'default'
    };

    self
      .fetch(this.url, params)
      // eslint-disable-next-line consistent-return
      .then((res) => {
        if (res.ok && res.status >= 200 && res.status <= 299) {
          this.progress = 1;
          this.established = true;
          return this.pump(res.body.getReader());
        }
        // error
      })
      .catch((err) => {
        throw err;
      });
  }

  pump(reader) {
    return (
      reader
        .read()
        // eslint-disable-next-line consistent-return
        .then((result) => {
          if (result.done) {
            this.completed = true;
          } else {
            if (this.aborted) {
              return reader.cancel();
            }

            if (this.destination) {
              this.destination.write(result.value.buffer);
            }

            return this.pump(reader);
          }
        })
        .catch((err) => {
          throw err;
        })
    );
  }

  resume() {
    // Nothing to do here
  }

  abort() {
    this.aborted = true;
  }
}
