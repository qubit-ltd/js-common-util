////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import deepEqual from '../src/deep-equal';

describe('deepEqual', () => {
  test('primitives', () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual(1, 2)).toBe(false);
    expect(deepEqual('a', 'a')).toBe(true);
    expect(deepEqual('a', 'b')).toBe(false);
    expect(deepEqual(true, true)).toBe(true);
    expect(deepEqual(true, false)).toBe(false);
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(undefined, undefined)).toBe(true);
    expect(deepEqual(null, undefined)).toBe(false);
    expect(deepEqual(NaN, NaN)).toBe(true);
  });

  test('objects', () => {
    expect(deepEqual({}, {})).toBe(true);
    expect(deepEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(deepEqual({ a: 1 }, { b: 1 })).toBe(false);
    expect(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
    expect(deepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
    expect(deepEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
  });

  test('arrays', () => {
    expect(deepEqual([], [])).toBe(true);
    expect(deepEqual([1, 2], [1, 2])).toBe(true);
    expect(deepEqual([1, 2], [2, 1])).toBe(false);
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
    expect(deepEqual([{ a: 1 }], [{ a: 1 }])).toBe(true);
  });

  test('circular references', () => {
    const a = { x: 1 };
    a.self = a;
    const b = { x: 1 };
    b.self = b;
    expect(deepEqual(a, b)).toBe(true);

    const c = { x: 1 };
    c.self = c;
    const d = { x: 2 };
    d.self = d;
    expect(deepEqual(c, d)).toBe(false);
  });

  test('Dates', () => {
    const d1 = new Date('2022-01-01');
    const d2 = new Date('2022-01-01');
    const d3 = new Date('2022-01-02');
    expect(deepEqual(d1, d2)).toBe(true);
    expect(deepEqual(d1, d3)).toBe(false);
  });

  test('RegExps', () => {
    expect(deepEqual(/a/g, /a/g)).toBe(true);
    expect(deepEqual(/a/g, /b/g)).toBe(false);
    expect(deepEqual(/a/g, /a/i)).toBe(false);
  });

  test('Maps', () => {
    const m1 = new Map([['a', 1], ['b', { c: 2 }]]);
    const m2 = new Map([['a', 1], ['b', { c: 2 }]]);
    const m3 = new Map([['a', 1], ['b', { c: 3 }]]);
    expect(deepEqual(m1, m2)).toBe(true);
    expect(deepEqual(m1, m3)).toBe(false);
    expect(deepEqual(new Map(), new Map())).toBe(true);
  });

  test('Sets', () => {
    const s1 = new Set(['a', 1, { b: 2 }]);
    const s2 = new Set(['a', 1, { b: 2 }]);
    expect(deepEqual(s1, s2)).toBe(true);
    // Note: Set equality with objects as values might be tricky if not handled by standard deepEqual
    // My implementation checks if b.has(item), which for objects means referential equality.
    // fast-deep-equal v3 also has limitations with Sets/Maps containing objects.
    // Let's see how mine behaves.
  });

  test('TypedArrays', () => {
    expect(deepEqual(new Int32Array([1, 2]), new Int32Array([1, 2]))).toBe(true);
    expect(deepEqual(new Int32Array([1, 2]), new Int32Array([1, 3]))).toBe(false);
    expect(deepEqual(new Uint8Array([1, 2]), new Uint8Array([1, 2]))).toBe(true);
    expect(deepEqual(new Int32Array([1, 2]), new Uint8Array([1, 2]))).toBe(false);
  });

  test('custom valueOf/toString', () => {
    class Custom {
      constructor(v) { this.v = v; }

      valueOf() { return this.v; }
    }
    expect(deepEqual(new Custom(1), new Custom(1))).toBe(true);
    expect(deepEqual(new Custom(1), new Custom(2))).toBe(false);
  });
});
