import { readFileSync } from 'fs';

export function extractFileContent(fileName: string) {
  const text = readFileSync(fileName, 'utf8');
  return text.split(/\n/).map((text, index) => ({
    text: text,
    line: index,
  }));
}
