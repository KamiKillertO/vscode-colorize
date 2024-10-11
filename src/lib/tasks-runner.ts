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
  run(f: () => IterableIterator<T>): TasksRunner<T> {
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
  stop(): void {
    if (this._currentTask) {
      this._currentTask.return?.();
    }
  }

  _run(): void {
    // cannot be null here
    const it = this._currentTask as IterableIterator<T>;

    // TODO improve type
    function run(args?: unknown): any | never {
      try {
        const result = it.next(args); // deal with errors in generators

        return result.done
          ? result.value
          : Promise.resolve(result.value).then(run); // Weird
      } catch (error) {
        // do something
      }
    }
    run();
  }
}

export default TasksRunner;
