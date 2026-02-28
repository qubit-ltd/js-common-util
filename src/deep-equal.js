////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Performs a deep equality comparison between two values.
 *
 * This implementation supports ES6 Map, Set, and Typed arrays, is circular
 * reference safe, and is highly optimized.
 *
 * @param {any} a
 *     The first value to compare.
 * @param {any} b
 *     The second value to compare.
 * @return {boolean}
 *     `true` if the values are deeply equal, `false` otherwise.
 * @author Haixing Hu
 */
function deepEqual(a, b) {
  return deepEqualRecursive(a, b, new Map());
}

function deepEqualRecursive(a, b, seen) {
  if (a === b) {
    return true;
  }

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    if (a.constructor !== b.constructor) {
      return false;
    }

    if (seen.has(a) && seen.get(a) === b) {
      return true;
    }
    seen.set(a, b);

    let i;
    let length;
    if (Array.isArray(a)) {
      length = a.length;
      if (length !== b.length) {
        return false;
      }
      for (i = length; i-- !== 0;) {
        if (!deepEqualRecursive(a[i], b[i], seen)) {
          return false;
        }
      }
      return true;
    }

    if (a instanceof Map) {
      if (a.size !== b.size) {
        return false;
      }
      for (i of a.entries()) {
        if (!b.has(i[0])) {
          return false;
        }
      }
      for (i of a.entries()) {
        if (!deepEqualRecursive(i[1], b.get(i[0]), seen)) {
          return false;
        }
      }
      return true;
    }

    if (a instanceof Set) {
      if (a.size !== b.size) {
        return false;
      }
      for (const itemA of a) {
        let found = false;
        for (const itemB of b) {
          if (deepEqualRecursive(itemA, itemB, seen)) {
            found = true;
            break;
          }
        }
        if (!found) {
          return false;
        }
      }
      return true;
    }

    if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
      length = a.length;
      if (length !== b.length) {
        return false;
      }
      for (i = length; i-- !== 0;) {
        if (a[i] !== b[i]) {
          return false;
        }
      }
      return true;
    }

    if (a.constructor === RegExp) {
      return a.source === b.source && a.flags === b.flags;
    }
    if (a.valueOf !== Object.prototype.valueOf) {
      return a.valueOf() === b.valueOf();
    }
    if (a.toString !== Object.prototype.toString) {
      return a.toString() === b.toString();
    }

    const keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) {
      return false;
    }

    for (i = length; i-- !== 0;) {
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) {
        return false;
      }
    }

    for (i = length; i-- !== 0;) {
      const key = keys[i];
      if (!deepEqualRecursive(a[key], b[key], seen)) {
        return false;
      }
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a !== a && b !== b;
}

export default deepEqual;
