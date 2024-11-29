import { globSync } from 'glob';
import Mocha from 'mocha';
import path from 'path';

export function run(
  testsRoot: string,
  cb: (error: Error | null, failures?: number) => void,
) {
  const mocha = new Mocha({ color: true, ui: 'tdd' });

  const files = globSync('**/**.test.js', { cwd: testsRoot });

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
}
