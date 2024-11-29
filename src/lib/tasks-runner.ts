class TasksRunner<T extends Generator<unknown>> {
  private _currentTask: IterableIterator<T> | null = null;

  /**
   * Add a task to run.
   * Pushing a new task will cancel the execution of the previous
   *
   * @param {Generator} IterableIterator<any>
   * @returns
   * @memberOf TasksRunner
   */
  run(f: () => IterableIterator<T>) {
    if (this._currentTask) {
      this._currentTask.return?.();
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
  stop() {
    if (this._currentTask) {
      this._currentTask.return?.();
    }
  }

  _run() {
    // cannot be null here
    const it = this._currentTask as IterableIterator<T>;

    // TODO improve type
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents, @typescript-eslint/no-explicit-any
    function run(args?: unknown): never | any {
      try {
        const result = it.next(args); // deal with errors in generators

        return result.done
          ? result.value
          : Promise.resolve(result.value).then(run); // Weird
      } catch {
        // do something
      }
    }
    run();
  }
}

export default TasksRunner;
