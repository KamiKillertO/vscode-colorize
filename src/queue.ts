class Queue {

  private _running = false;

  private _queue: Function[] = [];

  public push(f: Function) {
    this._queue.push(f);

    if (!this._running) {
      // if nothing is running, then start the engines!
      this._next();
    }

    return this; // for chaining fun!
  }
  private _next() {
    this._running = false;
    // get the first element off the queue
    let action = this._queue.shift();
    if (action) {
      this._running = true;
      new Promise((resolve, reject) => action(resolve)).then(this._next.bind(this));
      // action(() => {
      //   this._next();
      // });
    }
  }
}

export default Queue;
