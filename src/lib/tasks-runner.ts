class TasksRunner<T> {
  private _currentTask: IterableIterator<T> = null;

  /**
   * Add a task to run.
   * Pushing a new task will cancel the execution of the previous
   *
   * @param {Generator} IterableIterator<any>
   * @returns
   * @memberOf TasksRunner
   */
  run(f: () => IterableIterator<T>): TasksRunner<T> {
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

  _run(): void {
    const it: IterableIterator<T> = this._currentTask;
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    function run(args?: any) {
      try {
        const result: IteratorResult<T> = it.next(args); // deal with errors in generators
        if (result.done) {
          return result.value;
        } else {
          return Promise.resolve(result.value).then(run);
        }
      } catch (error) {
        // do something
      }
    }
    run();
  }
}

export default TasksRunner;
