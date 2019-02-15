class TasksRunner {
  private _currentTask: IterableIterator<any> = null;

  /**
   * Add a task to run.
   * Pushing a new task will cancel the execution of the previous
   *
   * @param {Generator} IterableIterator<any>
   * @returns
   * @memberOf TasksRunner
   */
  run(f: () => IterableIterator<any>) {
    if (this._currentTask) {
      this._currentTask.return();
    }
    this._currentTask = f();
    this._run();
    return this; // for chaining fun!
  }
  /**
   * Cancel the currently running task
   *
   * @memberOf TasksRunner
   */
  stop(): void {
    if (this._currentTask) {
      this._currentTask.return();
    }
  }

  _run() {
    let it: IterableIterator<any> = this._currentTask;
    function run(args?: any) {
      try {
        let result: IteratorResult<any> = it.next(args); // deal with errors in generators
        if (result.done) {
          return result.value;
        } else {
          return Promise.resolve(result.value).then(run);
        }
      } catch (error) {}
    }
    run();
  }
}

export default TasksRunner;
