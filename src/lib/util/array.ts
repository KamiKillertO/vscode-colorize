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

// Return all map's keys in an array
function mapKeysToArray(map: Map < number, any > ) {
  return Array.from(map.keys());
}

function equals(arr1: any[], arr2: any[]) {
  if (arr1 === null || arr2 === null) {
    return false;
  }
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i in arr1) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

export { flatten, unique, mapKeysToArray, equals };
