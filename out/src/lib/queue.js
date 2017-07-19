"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Queue {
    constructor() {
        this._running = false;
        this._queue = [];
    }
    /**
     * Add a action inside the queue.
     * The action should take a callback as first parameter and call it
     * when his work is done in order to start the next action
     *
     * @param {Function} f
     * @returns
     * @memberOf Queue
     */
    push(f) {
        this._queue.push(f);
        if (!this._running) {
            // if nothing is running, then start the engines!
            this._next();
        }
        return this; // for chaining fun!
    }
    _next() {
        this._running = false;
        let action = this._queue.shift();
        if (action) {
            this._running = true;
            action(this._next.bind(this));
        }
    }
}
exports.default = Queue;
//# sourceMappingURL=queue.js.map