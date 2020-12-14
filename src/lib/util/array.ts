type callbackFn<V> = (value: V, index: number, array: Array<V>) => V;

function unique<T>(arr: Array<T>, f?: callbackFn<T>): Array<T> {
  let vArr = arr;
  if (f) {
    vArr = arr.map(f);
  }
  return arr.filter((_, i) => vArr.indexOf(vArr[i]) === i);
}

// Return all map's keys in an array
function mapKeysToArray<T>(map: Map<number, T>): Array<number> {
  return Array.from(map.keys());
}

function equals<T>(arr1: Array<T>, arr2: Array<T>) : boolean {
  if (arr1 === null || arr2 === null) {
    return false;
  }
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (const i in arr1) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

export { unique, equals };
