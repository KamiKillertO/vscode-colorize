// eslint-disable-next-line quotes,no-useless-escape
const EOL = `(?:$|\`|"|'|,| |;|\\)|\\r|\\n|\}|<)`;

const DOT_VALUE = '(?:\\.\\d+)'; // ['.x', '']
const ALPHA = `(?:1(:?\\.0+)?|0${DOT_VALUE}?|${DOT_VALUE})`; // ['0', '1', '0.x', '1.0', '.x']
const HEXA_VALUE = '[\\da-f]'; // [1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F']

export { EOL, ALPHA, DOT_VALUE, HEXA_VALUE };
