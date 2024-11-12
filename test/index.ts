import glob from 'glob';
import Mocha from 'mocha';
import path from 'path';

export function run(
  testsRoot: string,
  cb: (error: Error | null, failures?: number) => void,
): void {
  const mocha = new Mocha({ color: true, ui: 'tdd' });

  glob('**/**.test.js', { cwd: testsRoot }, (err, files) => {
    if (err) {
      cb(err);
      return;
    }

    // Add files to the test suite
    files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

    try {
      // Run the mocha test
      mocha.run((failures) => {
        cb(null, failures);
      });
    } catch (error) {
      cb(error as Error);
    }
  });
}
