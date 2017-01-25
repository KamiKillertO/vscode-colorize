
class Queue {

  private _running = false;

  private _queue: Function[] = [];

  public push(f:Function) {

    var _this = this;
    this._queue.push(f);

    if(!this._running) {
        // if nothing is running, then start the engines!
        this._next();
    }

    return this; // for chaining fun!
  }
  private _next() {
    this._running = false;
    //get the first element off the queue
    var shift = this._queue.shift(); 
    if(shift) { 
        this._running = true;
        shift(()=> {
          this._next();
        }); 
    }
  }
}

export default Queue;
