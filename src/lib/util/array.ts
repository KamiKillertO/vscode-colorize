type callbackFn = (value: any, index: number, array: any[]) => any;

function flatten(arr: any[]): any[] {
  return Array.prototype.concat.apply([], arr);
}

function unique(arr: any[], f?: callbackFn) {
  let vArr = arr;
  if (f) {
    vArr = arr.map(f);
  }
  return arr.filter((_, i) => vArr.indexOf(vArr[i]) === i);
}

export { flatten, unique };
