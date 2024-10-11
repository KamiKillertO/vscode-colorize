type QueueItem = (cb: () => void) => unknown;
class Queue {
  private _running = false;

  private _queue: Array<QueueItem> = [];
  /**
   * Add a action inside the queue.
   * The action should take a callback as first parameter and call it
   * when his work is done in order to start the next action
   *
   * @param {Function} f
   * @returns
   * @memberOf Queue
   */
  public push(f: QueueItem): Queue {
    this._queue.push(f);
    if (!this._running) {
      // if nothing is running, then start the engines!
      this._next();
    }
    return this; // for chaining fun!
  }

  private _next() {
    this._running = false;
    const action = this._queue.shift();
    if (action) {
      this._running = true;
      try {
        action(this._next.bind(this));
      } catch {
        this._next.call(this);
      }
    }
  }
}

export default Queue;
