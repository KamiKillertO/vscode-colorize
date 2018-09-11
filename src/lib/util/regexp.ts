const EOL = `(?:$|"|'|,| |;|\\)|\\r|\\n)`;

const DOT_VALUE = `(?:\\.\\d+)`; // ['.x', '']
const ALPHA = `(?:1(:?\\.0)?|0${DOT_VALUE}?|${DOT_VALUE})`; // ['0', '1', '0.x', '1.0', '.x']

export { EOL, ALPHA, DOT_VALUE };
