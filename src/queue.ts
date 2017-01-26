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
    if(shift) { 
        this._running = true;
        shift(()=> {
          this._next();
        }); 
    // get the first element off the queue
    let action = this._queue.shift();
    }
  }
}

export default Queue;
