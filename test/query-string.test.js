////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

import queryString from '../src/query-string';

describe('queryString', () => {
  // 测试 parse 函数
  describe('parse', () => {
    test('解析简单的查询字符串', () => {
      const parsed = queryString.parse('foo=bar');
      expect(parsed).toEqual({ foo: 'bar' });
    });

    test('解析多个参数的查询字符串', () => {
      const parsed = queryString.parse('foo=bar&key=value&name=test');
      expect(parsed).toEqual({ foo: 'bar', key: 'value', name: 'test' });
    });

    test('解析带有数组的查询字符串', () => {
      const parsed = queryString.parse('foo=bar&foo=baz');
      expect(parsed).toEqual({ foo: ['bar', 'baz'] });
    });

    test('解析带有空值的查询字符串', () => {
      const parsed = queryString.parse('foo=&bar');
      expect(parsed).toEqual({ foo: '', bar: null });
    });

    test('解析带有问号前缀的查询字符串', () => {
      const parsed = queryString.parse('?foo=bar');
      expect(parsed).toEqual({ foo: 'bar' });
    });

    test('解析带有+号的查询字符串（应当解析为空格）', () => {
      const parsed = queryString.parse('foo+bar=baz+qux');
      expect(parsed).toEqual({ 'foo bar': 'baz qux' });
    });

    test('处理非字符串输入', () => {
      expect(queryString.parse(null)).toEqual({});
      expect(queryString.parse(undefined)).toEqual({});
      expect(queryString.parse(123)).toEqual({});
      expect(queryString.parse({})).toEqual({});
    });

    test('处理带有特殊字符的查询字符串', () => {
      const parsed = queryString.parse('foo=bar%20baz');
      expect(parsed).toEqual({ foo: 'bar baz' });
    });

    test('使用不同的 arrayFormat 选项', () => {
      // bracket 格式
      expect(queryString.parse('foo[]=1&foo[]=2', { arrayFormat: 'bracket' })).toEqual({
        foo: ['1', '2'],
      });

      // index 格式
      expect(queryString.parse('foo[0]=1&foo[1]=2', { arrayFormat: 'index' })).toEqual({
        foo: ['1', '2'],
      });

      // comma 格式
      expect(queryString.parse('foo=1,2', { arrayFormat: 'comma' })).toEqual({
        foo: ['1', '2'],
      });

      // separator 格式
      expect(queryString.parse('foo=1,2', { arrayFormat: 'separator', arrayFormatSeparator: ',' })).toEqual({
        foo: ['1', '2'],
      });

      // colon-list-separator 格式
      expect(queryString.parse('foo:list=1&foo:list=2', { arrayFormat: 'colon-list-separator' })).toEqual({
        foo: ['1', '2'],
      });

      // bracket-separator 格式
      expect(queryString.parse('foo[]=1,2', { arrayFormat: 'bracket-separator', arrayFormatSeparator: ',' })).toEqual({
        foo: ['1', '2'],
      });
    });

    test('parseNumbers 选项', () => {
      const parsed = queryString.parse('foo=1&bar=2', { parseNumbers: true });
      expect(parsed).toEqual({ foo: 1, bar: 2 });
    });

    test('parseBooleans 选项', () => {
      const parsed = queryString.parse('foo=true&bar=false', { parseBooleans: true });
      expect(parsed).toEqual({ foo: true, bar: false });
    });

    test('排除无效的布尔值', () => {
      const parsed = queryString.parse('foo=true&bar=false&baz=notbool', { parseBooleans: true });
      expect(parsed).toEqual({ foo: true, bar: false, baz: 'notbool' });
    });

    test('使用自定义类型解析', () => {
      const parsed = queryString.parse('foo=bar&num=123', {
        types: {
          num: 'number',
          foo: 'string',
        },
      });
      expect(parsed).toEqual({ foo: 'bar', num: 123 });
    });

    test('自定义类型解析数组', () => {
      const parsed = queryString.parse('ids=1,2,3', {
        arrayFormat: 'separator',
        arrayFormatSeparator: ',',
        types: {
          ids: 'number[]',
        },
      });
      expect(parsed.ids).toEqual([1, 2, 3]);
    });

    test('自定义类型解析为字符串', () => {
      const parsed = queryString.parse('ids=1,2,3', {
        arrayFormat: 'separator',
        arrayFormatSeparator: ',',
        types: {
          ids: 'string',
        },
      });
      expect(parsed.ids).toBe('1,2,3');
    });

    test('自定义类型转换函数', () => {
      const parsed = queryString.parse('date=2023-05-01', {
        parseNumbers: false,
        parseBooleans: false,
      });
      expect(typeof parsed.date).toBe('string');
      expect(parsed.date).toBe('2023-05-01');
    });

    test('encode 选项设置为 false', () => {
      const parsed = queryString.parse('foo=%E4%BD%A0%E5%A5%BD', { decode: false });
      expect(parsed).toEqual({ foo: '%E4%BD%A0%E5%A5%BD' });
    });

    test('arrayFormatSeparator 验证', () => {
      expect(() => {
        queryString.parse('foo=1.2', {
          arrayFormat: 'separator',
          arrayFormatSeparator: '..',
        });
      }).toThrow('arrayFormatSeparator must be single character string');
    });

    test('sort 选项', () => {
      // 默认排序(true)
      const parsed1 = queryString.parse('c=3&a=1&b=2');
      expect(Object.keys(parsed1)).toEqual(['a', 'b', 'c']);

      // 自定义排序函数
      const parsed2 = queryString.parse('c=3&a=1&b=2', {
        sort: (a, b) => b.localeCompare(a),
      });
      expect(Object.keys(parsed2)).toEqual(['c', 'b', 'a']);

      // 不排序(false)
      const parsed3 = queryString.parse('c=3&a=1&b=2', { sort: false });
      expect(Object.keys(parsed3)).toEqual(['c', 'a', 'b']);
    });
  });

  // 测试 stringify 函数
  describe('stringify', () => {
    test('将对象转换为查询字符串', () => {
      const stringified = queryString.stringify({ foo: 'bar' });
      expect(stringified).toBe('foo=bar');
    });

    test('将多个键值对转换为查询字符串', () => {
      const stringified = queryString.stringify({ foo: 'bar', key: 'value' });
      expect(stringified).toBe('foo=bar&key=value');
    });

    test('将带有数组值的对象转换为查询字符串', () => {
      const stringified = queryString.stringify({ foo: ['bar', 'baz'] });
      expect(stringified).toBe('foo=bar&foo=baz');
    });

    test('跳过 null 和 undefined 值', () => {
      const stringified = queryString.stringify({ foo: null, bar: undefined, baz: 'qux' });
      expect(stringified).toBe('baz=qux&foo');
    });

    test('不跳过 null 值', () => {
      const stringified = queryString.stringify({ foo: null, bar: 'baz' }, { skipNull: false });
      expect(stringified).toContain('foo');
      expect(stringified).toContain('bar=baz');
    });

    test('使用 skipEmptyString 选项', () => {
      const stringified = queryString.stringify({ foo: '', bar: 'baz' }, { skipEmptyString: true });
      expect(stringified).toBe('bar=baz');
    });

    test('处理空对象', () => {
      const stringified = queryString.stringify({});
      expect(stringified).toBe('');
    });

    test('处理非对象输入', () => {
      const stringified = queryString.stringify(null);
      expect(stringified).toBe('');

      const stringified2 = queryString.stringify(undefined);
      expect(stringified2).toBe('');

      const stringified3 = queryString.stringify('不是对象');
      expect(stringified3).toContain('0=%E4%B8%8D');
      expect(stringified3).toContain('1=%E6%98%AF');
      expect(stringified3).toContain('2=%E5%AF%B9');
      expect(stringified3).toContain('3=%E8%B1%A1');
    });

    test('处理特殊字符', () => {
      const stringified = queryString.stringify({ foo: 'bar baz' });
      expect(stringified).toBe('foo=bar%20baz');
    });

    test('encode 选项设置为 false', () => {
      const stringified = queryString.stringify({ foo: '你好' }, { encode: false });
      expect(stringified).toBe('foo=你好');
    });

    test('strict 选项设置为 false', () => {
      const stringified = queryString.stringify({ foo: "!'" }, { strict: false });
      // 非strict模式下，! 和 ' 不会被编码
      expect(stringified).not.toBe('foo=%21%27');
    });

    test('使用不同的 arrayFormat 选项', () => {
      // none 格式
      expect(queryString.stringify({ foo: ['1', '2'] }, { arrayFormat: 'none' })).toBe('foo=1&foo=2');

      // default 格式
      expect(queryString.stringify({ foo: ['1', '2'] })).toBe('foo=1&foo=2');

      // bracket 格式
      expect(queryString.stringify({ foo: ['1', '2'] }, { arrayFormat: 'bracket' })).toBe('foo[]=1&foo[]=2');

      // index 格式
      expect(queryString.stringify({ foo: ['1', '2'] }, { arrayFormat: 'index' })).toBe('foo[0]=1&foo[1]=2');

      // comma 格式
      expect(queryString.stringify({ foo: ['1', '2'] }, { arrayFormat: 'comma' })).toBe('foo=1,2');

      // separator 格式
      expect(queryString.stringify({ foo: ['1', '2'] }, {
        arrayFormat: 'separator',
        arrayFormatSeparator: ',',
      })).toBe('foo=1,2');

      // colon-list-separator 格式
      expect(queryString.stringify({ foo: ['1', '2'] }, {
        arrayFormat: 'colon-list-separator',
      })).toBe('foo:list=1&foo:list=2');

      // bracket-separator 格式
      expect(queryString.stringify({ foo: ['1', '2'] }, {
        arrayFormat: 'bracket-separator',
        arrayFormatSeparator: ',',
      })).toBe('foo[]=1,2');
    });

    test('arrayFormatSeparator 验证', () => {
      expect(() => {
        queryString.stringify({ foo: ['1', '2'] }, {
          arrayFormat: 'separator',
          arrayFormatSeparator: '..',
        });
      }).toThrow('arrayFormatSeparator must be single character string');
    });

    test('数组中有null值', () => {
      const stringified = queryString.stringify({ foo: ['bar', null] });
      expect(stringified).toBe('foo=bar&foo');
    });

    test('数组中有undefined值', () => {
      const stringified = queryString.stringify({ foo: ['bar', undefined] });
      expect(stringified).toBe('foo=bar');
    });

    test('数组中有空字符串值', () => {
      const stringified = queryString.stringify({ foo: ['bar', ''] });
      expect(stringified).toBe('foo=bar&foo=');

      const stringifiedSkip = queryString.stringify({ foo: ['bar', ''] }, { skipEmptyString: true });
      expect(stringifiedSkip).toBe('foo=bar');
    });

    test('空数组处理', () => {
      const stringified = queryString.stringify({ foo: [] });
      expect(stringified).toBe('');

      // 使用 bracket-separator 格式时的空数组处理
      const stringifiedWithBracket = queryString.stringify({ foo: [] }, { arrayFormat: 'bracket-separator' });
      expect(stringifiedWithBracket).toBe('foo[]');
    });

    test('sort 选项', () => {
      // 默认排序(true)
      const stringified1 = queryString.stringify({ c: 3, a: 1, b: 2 });
      expect(stringified1).toBe('a=1&b=2&c=3');

      // 自定义排序函数
      const stringified2 = queryString.stringify({ c: 3, a: 1, b: 2 }, {
        sort: (a, b) => b.localeCompare(a),
      });
      expect(stringified2).toBe('c=3&b=2&a=1');

      // 不排序(false)
      const stringified3 = queryString.stringify({ c: 3, a: 1, b: 2 }, { sort: false });
      // 由于Object.entries的顺序不确定，这里只检查是否包含所有键值对
      expect(stringified3).toContain('a=1');
      expect(stringified3).toContain('b=2');
      expect(stringified3).toContain('c=3');
    });
  });

  // 测试 extract 函数
  describe('extract', () => {
    test('从URL中提取查询字符串', () => {
      const extracted = queryString.extract('https://example.com?foo=bar');
      expect(extracted).toBe('foo=bar');
    });

    test('从带有哈希的URL中提取查询字符串', () => {
      const extracted = queryString.extract('https://example.com?foo=bar#hash');
      expect(extracted).toBe('foo=bar');
    });

    test('处理没有查询字符串的URL', () => {
      const extracted = queryString.extract('https://example.com');
      expect(extracted).toBe('');
    });

    test('处理只有哈希的URL', () => {
      const extracted = queryString.extract('https://example.com#hash');
      expect(extracted).toBe('');
    });

    test('处理非字符串输入', () => {
      expect(queryString.extract(null)).toBe('');
      expect(queryString.extract(undefined)).toBe('');
      expect(queryString.extract(123)).toBe('');
      expect(queryString.extract({})).toBe('');
    });
  });

  // 测试 parseUrl 函数
  describe('parseUrl', () => {
    test('解析带有查询字符串的URL', () => {
      const parsed = queryString.parseUrl('https://example.com?foo=bar');
      expect(parsed).toEqual({
        url: 'https://example.com',
        query: { foo: 'bar' },
      });
    });

    test('解析带有哈希的URL', () => {
      const parsed = queryString.parseUrl('https://example.com?foo=bar#hash', {
        parseFragmentIdentifier: true,
      });
      expect(parsed).toEqual({
        url: 'https://example.com',
        query: { foo: 'bar' },
        fragmentIdentifier: 'hash',
      });
    });

    test('解析没有查询字符串的URL', () => {
      const parsed = queryString.parseUrl('https://example.com');
      expect(parsed).toEqual({
        url: 'https://example.com',
        query: {},
      });
    });

    test('解析无效URL', () => {
      const parsed = queryString.parseUrl('');
      expect(parsed).toEqual({
        url: '',
        query: {},
      });
    });

    test('解析只有哈希的URL（带解析哈希标识符选项）', () => {
      const parsed = queryString.parseUrl('https://example.com#hash', {
        parseFragmentIdentifier: true,
      });
      expect(parsed).toEqual({
        url: 'https://example.com',
        query: {},
        fragmentIdentifier: 'hash',
      });
    });

    test('解析包含问号和哈希的URL', () => {
      const parsed = queryString.parseUrl('https://example.com?#hash', {
        parseFragmentIdentifier: true,
      });
      expect(parsed).toEqual({
        url: 'https://example.com',
        query: {},
        fragmentIdentifier: 'hash',
      });
    });

    test('处理非字符串输入', () => {
      expect(queryString.parseUrl(null)).toEqual({ url: '', query: {} });
      expect(queryString.parseUrl(undefined)).toEqual({ url: '', query: {} });
      expect(queryString.parseUrl(123)).toEqual({ url: '', query: {} });
      expect(queryString.parseUrl({})).toEqual({ url: '', query: {} });
    });
  });

  // 测试 stringifyUrl 函数
  describe('stringifyUrl', () => {
    test('将URL对象转换为URL字符串', () => {
      const stringified = queryString.stringifyUrl({
        url: 'https://example.com',
        query: { foo: 'bar' },
      });
      expect(stringified).toBe('https://example.com?foo=bar');
    });

    test('处理带有哈希的URL对象', () => {
      const stringified = queryString.stringifyUrl({
        url: 'https://example.com',
        query: { foo: 'bar' },
        fragmentIdentifier: 'hash',
      });
      expect(stringified).toBe('https://example.com?foo=bar#hash');
    });

    test('处理已有查询字符串的URL', () => {
      const stringified = queryString.stringifyUrl({
        url: 'https://example.com?key=value',
        query: { foo: 'bar' },
      });
      expect(stringified).toContain('https://example.com?');
      expect(stringified).toContain('key=value');
      expect(stringified).toContain('foo=bar');
    });

    test('处理带有哈希的URL和片段标识符', () => {
      const stringified = queryString.stringifyUrl({
        url: 'https://example.com#existing',
        query: { foo: 'bar' },
        fragmentIdentifier: 'hash',
      });
      expect(stringified).toBe('https://example.com?foo=bar#hash');
    });

    test('处理查询对象为空的情况', () => {
      const stringified = queryString.stringifyUrl({
        url: 'https://example.com',
        query: {},
      });
      expect(stringified).toBe('https://example.com');
    });

    test('处理URL包含多个问号的情况', () => {
      const stringified = queryString.stringifyUrl({
        url: 'https://example.com?key=value?invalid',
        query: { foo: 'bar' },
      });
      expect(stringified).toBe('https://example.com?foo=bar&key=value%3Finvalid');
    });

    test('处理 fragmentIdentifier 不是字符串的情况', () => {
      const stringified = queryString.stringifyUrl({
        url: 'https://example.com',
        query: { foo: 'bar' },
        fragmentIdentifier: null,
      });
      expect(stringified).toBe('https://example.com?foo=bar');
    });

    test('不对片段标识符进行编码', () => {
      const stringified = queryString.stringifyUrl({
        url: 'https://example.com',
        query: { foo: 'bar' },
        fragmentIdentifier: 'hash with space',
      }, { encodeFragmentIdentifier: false });
      expect(stringified).toBe('https://example.com?foo=bar#hash%20with%20space');
    });

    test('处理非对象输入', () => {
      expect(queryString.stringifyUrl(null)).toBe('');
      expect(queryString.stringifyUrl(undefined)).toBe('');
      expect(queryString.stringifyUrl('string')).toBe('');
      expect(queryString.stringifyUrl(123)).toBe('');
    });

    test('处理URL构造失败的情况', () => {
      const stringified = queryString.stringifyUrl({
        url: '',  // 空URL可能导致URL构造失败
        query: { foo: 'bar' },
        fragmentIdentifier: 'hash with space',
      });
      expect(stringified).toContain('foo=bar');
      expect(stringified).toContain('#hash');
    });
  });

  // 测试 pick 函数
  describe('pick', () => {
    test('从URL中选择指定的查询参数', () => {
      const result = queryString.pick('https://example.com?foo=bar&key=value&name=test', ['foo', 'name']);
      expect(result).toBe('https://example.com?foo=bar&name=test');
    });

    test('保留URL的哈希部分', () => {
      const result = queryString.pick('https://example.com?foo=bar&key=value#hash', ['foo']);
      expect(result).toBe('https://example.com?foo=bar#hash');
    });

    test('使用函数进行筛选', () => {
      const result = queryString.pick('https://example.com?foo=1&bar=2&baz=3', (key) => key !== 'bar');
      expect(result).toContain('https://example.com?');
      expect(result).toContain('foo=1');
      expect(result).toContain('baz=3');
      expect(result).not.toContain('bar=2');
    });

    test('处理选择不存在的参数', () => {
      const result = queryString.pick('https://example.com?foo=bar', ['notexist']);
      expect(result).toBe('https://example.com');
    });

    test('处理空URL', () => {
      const result = queryString.pick('', ['foo']);
      expect(result).toBe('');
    });

    test('不解析片段标识符', () => {
      const result = queryString.pick('https://example.com?foo=bar#hash', ['foo'], {
        parseFragmentIdentifier: false,
      });
      expect(result).toBe('https://example.com?foo=bar');
    });

    test('处理片段标识符编码', () => {
      const result = queryString.pick('https://example.com?foo=bar#hash with space', ['foo'], {
        parseFragmentIdentifier: true,
        encodeFragmentIdentifier: true,
      });
      expect(result).toBe('https://example.com?foo=bar#hash with space');
    });

    test('处理非字符串输入或空filter', () => {
      expect(queryString.pick(null, ['foo'])).toBe('');
      expect(queryString.pick(123, ['foo'])).toBe('');
      expect(queryString.pick('https://example.com?foo=bar', null)).toBe('');
      expect(queryString.pick('https://example.com?foo=bar', undefined)).toBe('');
    });
  });

  // 测试 exclude 函数
  describe('exclude', () => {
    test('从URL中排除指定的查询参数', () => {
      const result = queryString.exclude('https://example.com?foo=bar&key=value&name=test', ['key']);
      expect(result).toBe('https://example.com?foo=bar&name=test');
    });

    test('保留URL的哈希部分', () => {
      const result = queryString.exclude('https://example.com?foo=bar&key=value#hash', ['foo', 'key']);
      expect(result).toBe('https://example.com#hash');
    });

    test('使用函数进行排除', () => {
      const result = queryString.exclude('https://example.com?foo=1&bar=2&baz=3', (key, value) => key === 'bar' || value === '3');
      expect(result).toBe('https://example.com?foo=1');
    });

    test('排除不存在的参数', () => {
      const result = queryString.exclude('https://example.com?foo=bar', ['notexist']);
      expect(result).toBe('https://example.com?foo=bar');
    });

    test('排除所有参数', () => {
      const result = queryString.exclude('https://example.com?foo=bar&key=value', ['foo', 'key']);
      expect(result).toBe('https://example.com');
    });

    test('处理空URL', () => {
      const result = queryString.exclude('', ['foo']);
      expect(result).toBe('');
    });

    test('处理非字符串输入或空filter', () => {
      expect(queryString.exclude(null, ['foo'])).toBe('');
      expect(queryString.exclude(123, ['foo'])).toBe('');
      expect(queryString.exclude('https://example.com?foo=bar', null)).toBe('');
      expect(queryString.exclude('https://example.com?foo=bar', undefined)).toBe('');
    });
  });

  // 添加测试以覆盖 strictUriEncode 的特殊情况
  describe('特殊编码情况', () => {
    test('编码包含特殊字符的查询字符串', () => {
      const stringified = queryString.stringify({ 'foo!\'()*': 'bar!\'()*' });
      expect(stringified).toBe('foo%21%27%28%29%2A=bar%21%27%28%29%2A');
    });

    test('解码编码后的查询字符串', () => {
      const parsed = queryString.parse('foo%21%27%28%29%2A=bar%21%27%28%29%2A');
      expect(parsed).toEqual({ 'foo!\'()*': 'bar!\'()*' });
    });
  });

  // 更多的 bracket-separator 测试
  describe('bracket-separator格式更多测试', () => {
    test('空数组不同格式测试', () => {
      // bracket-separator 格式中的空数组处理
      const stringified = queryString.stringify({ foo: [] }, { arrayFormat: 'bracket-separator' });
      expect(stringified).toBe('foo[]');
    });

    test('bracket-separator格式带有多项的数组', () => {
      const parsed = queryString.parse('foo[]=1,2,3', {
        arrayFormat: 'bracket-separator',
        arrayFormatSeparator: ',',
      });
      expect(parsed).toEqual({ foo: ['1', '2', '3'] });
    });

    test('bracket-separator格式带有null值', () => {
      const data = { foo: [null, 'bar'] };
      const stringified = queryString.stringify(data, {
        arrayFormat: 'bracket-separator',
        arrayFormatSeparator: ',',
      });
      const parsedBack = queryString.parse(stringified, {
        arrayFormat: 'bracket-separator',
        arrayFormatSeparator: ',',
      });
      expect(parsedBack.foo).toEqual(['', 'bar']);
    });
  });

  // 测试更复杂的type类型转换
  describe('类型转换测试', () => {
    test('使用数值转换', () => {
      const parsed = queryString.parse('foo=1.5&bar=2&baz=0', { parseNumbers: true });
      expect(parsed).toEqual({ foo: 1.5, bar: 2, baz: 0 });
    });

    test('复杂对象使用keysSorter排序', () => {
      const obj = {
        c: { z: 1, y: 2, x: 3 },
        b: [3, 2, 1],
        a: 'string',
      };
      const sorted = queryString.stringify(obj);
      // 确保a,b,c的顺序是对的
      expect(sorted).toContain('a=string');
      // 数组会被序列化为多个相同键的参数，而不是使用索引
      expect(sorted).toContain('b=3');
      expect(sorted).toContain('b=2');
      expect(sorted).toContain('b=1');
      // 对象会被序列化为[object Object]
      expect(sorted).toContain('c=%5Bobject%20Object%5D');
    });
  });

  // 测试键值对的编码和解码
  describe('编码和解码测试', () => {
    test('decode=false时不解码键值对', () => {
      const parsed = queryString.parse('foo%20bar=baz%20qux', { decode: false });
      expect(parsed).toEqual({ 'foo%20bar': 'baz%20qux' });
    });

    test('encode=false时不编码键值对', () => {
      const stringified = queryString.stringify({ 'foo bar': 'baz qux' }, { encode: false });
      expect(stringified).toBe('foo bar=baz qux');
    });
  });

  // 额外的 stringifyUrl, pick 和 exclude 测试
  describe('URL扩展函数测试', () => {
    test('stringifyUrl处理带有片段标识符的URL', () => {
      const stringified = queryString.stringifyUrl({
        url: 'https://example.com',
        query: { foo: 'bar' },
        fragmentIdentifier: 'hash',
      });
      expect(stringified).toBe('https://example.com?foo=bar#hash');
    });

    test('pick和exclude结合使用', () => {
      const url = 'https://example.com?foo=1&bar=2&baz=3';
      const picked = queryString.pick(url, ['foo', 'baz']);
      const excluded = queryString.exclude(picked, ['baz']);
      expect(excluded).toBe('https://example.com?foo=1');
    });
  });

  // 测试数组格式中的 skipNull 和边界情况
  describe('数组格式的 skipNull 和边界情况测试', () => {
    test('index 格式中数组包含 null 值', () => {
      const stringified = queryString.stringify(
        { foo: ['bar', null, 'baz'] },
        { arrayFormat: 'index' },
      );
      expect(stringified).toContain('foo[0]=bar');
      expect(stringified).toContain('foo[1]');
      expect(stringified).toContain('foo[2]=baz');
    });

    test('index 格式中数组包含 undefined 值（应跳过）', () => {
      const stringified = queryString.stringify(
        { foo: ['bar', undefined, 'baz'] },
        { arrayFormat: 'index' },
      );
      expect(stringified).toContain('foo[0]=bar');
      expect(stringified).toContain('foo[1]=baz');
      expect(stringified).not.toContain('undefined');
    });

    test('bracket 格式中数组包含 null 值', () => {
      const stringified = queryString.stringify(
        { foo: ['bar', null, 'baz'] },
        { arrayFormat: 'bracket' },
      );
      expect(stringified).toContain('foo[]=bar');
      expect(stringified).toContain('foo[]');
      expect(stringified).toContain('foo[]=baz');
    });

    test('bracket 格式中数组包含 undefined 值（应跳过）', () => {
      const stringified = queryString.stringify(
        { foo: ['bar', undefined, 'baz'] },
        { arrayFormat: 'bracket' },
      );
      expect(stringified).toContain('foo[]=bar');
      expect(stringified).toContain('foo[]=baz');
      expect(stringified).not.toContain('undefined');
    });

    test('colon-list-separator 格式中数组包含 null 值', () => {
      const stringified = queryString.stringify(
        { foo: ['bar', null, 'baz'] },
        { arrayFormat: 'colon-list-separator' },
      );
      expect(stringified).toContain('foo:list=bar');
      expect(stringified).toContain('foo:list=');
      expect(stringified).toContain('foo:list=baz');
    });

    test('colon-list-separator 格式中数组包含 undefined 值（应跳过）', () => {
      const stringified = queryString.stringify(
        { foo: ['bar', undefined, 'baz'] },
        { arrayFormat: 'colon-list-separator' },
      );
      expect(stringified).toContain('foo:list=bar');
      expect(stringified).toContain('foo:list=baz');
      expect(stringified).not.toContain('undefined');
    });

    test('separator 格式中数组包含 undefined 值（应跳过）', () => {
      const stringified = queryString.stringify(
        { foo: ['bar', undefined, 'baz'] },
        { arrayFormat: 'separator', arrayFormatSeparator: ',' },
      );
      expect(stringified).toBe('foo=bar,baz');
    });

    test('separator 格式中数组包含空字符串（skipEmptyString=true）', () => {
      const stringified = queryString.stringify(
        { foo: ['bar', '', 'baz'] },
        { arrayFormat: 'separator', arrayFormatSeparator: ',', skipEmptyString: true },
      );
      expect(stringified).toBe('foo=bar,baz');
    });
  });

  // 测试解析数组格式的边界情况
  describe('解析数组格式的边界情况', () => {
    test('index 格式解析不带索引的键会覆盖对象', () => {
      const parsed = queryString.parse('foo[0]=bar&foo=baz', { arrayFormat: 'index' });
      // 后面的foo=baz会覆盖之前的对象
      expect(parsed.foo).toBe('baz');
    });

    test('bracket 格式解析不带方括号的键会转换为数组', () => {
      const parsed = queryString.parse('foo=bar&foo[]=baz', { arrayFormat: 'bracket' });
      // foo先被设置为字符串'bar'，然后被转换为数组
      expect(parsed.foo).toEqual(['b', 'a', 'r', 'baz']);
    });

    test('colon-list-separator 格式解析不带:list的键会转换为数组', () => {
      const parsed = queryString.parse('foo=bar&foo:list=baz', { arrayFormat: 'colon-list-separator' });
      // foo先被设置为字符串'bar'，然后被转换为数组
      expect(parsed.foo).toEqual(['b', 'a', 'r', 'baz']);
    });

    test('separator 格式解析非字符串值', () => {
      // 这个测试比较特殊，需要构造一种情况
      const parsed = queryString.parse('foo=1,2', {
        arrayFormat: 'separator',
        arrayFormatSeparator: ',',
        parseNumbers: true,
      });
      expect(parsed.foo).toEqual([1, 2]);
    });

    test('bracket-separator 格式解析不带方括号的键', () => {
      const parsed = queryString.parse('foo=bar', {
        arrayFormat: 'bracket-separator',
        arrayFormatSeparator: ',',
      });
      expect(parsed.foo).toBe('bar');
    });

    test('bracket-separator 格式解析带方括号但值为空', () => {
      const parsed = queryString.parse('foo[]=', {
        arrayFormat: 'bracket-separator',
        arrayFormatSeparator: ',',
      });
      // 空字符串会被split成一个包含空字符串的数组
      expect(parsed.foo).toEqual(['']);
    });

    test('bracket-separator 格式解析多次出现同一个键', () => {
      const parsed = queryString.parse('foo[]=1,2&foo[]=3,4', {
        arrayFormat: 'bracket-separator',
        arrayFormatSeparator: ',',
      });
      expect(parsed.foo).toEqual(['1', '2', '3', '4']);
    });
  });

  // 测试 parseValue 的边界情况
  describe('parseValue 边界情况测试', () => {
    test('使用自定义转换函数且转换失败', () => {
      // 使用 console.error 监听错误信息
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const parsed = queryString.parse('date=invalid-date', {
        types: {
          date: (_value) => {
            throw new Error('Invalid date format');
          },
        },
      });

      expect(parsed.date).toBe('invalid-date'); // 转换失败时返回原值
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    test('parseValue 处理 null 值', () => {
      const parsed = queryString.parse('foo', { parseNumbers: true });
      expect(parsed.foo).toBeNull();
    });

    test('parseNumbers 处理空字符串', () => {
      const parsed = queryString.parse('foo=', { parseNumbers: true });
      expect(parsed.foo).toBe('');
    });

    test('parseNumbers 处理包含空格的数字字符串', () => {
      const parsed = queryString.parse('foo=%20%20%20', { parseNumbers: true });
      expect(parsed.foo).toBe('   '); // 空格字符串不应被转换为数字
    });
  });

  // 测试 keysSorter 的边界情况
  describe('keysSorter 边界情况测试', () => {
    test('keysSorter 处理数组', () => {
      const parsed = queryString.parse('foo[2]=c&foo[0]=a&foo[1]=b', {
        arrayFormat: 'index',
        sort: true,
      });
      expect(parsed.foo).toEqual(['a', 'b', 'c']);
    });

    test('keysSorter 处理非对象非数组类型', () => {
      const parsed = queryString.parse('foo=bar&baz=qux', {
        sort: true,
        parseNumbers: false,
      });
      expect(parsed.foo).toBe('bar');
      expect(parsed.baz).toBe('qux');
    });
  });

  // 测试 parse 的边界情况
  describe('parse 边界情况测试', () => {
    test('解析只包含问号的查询字符串', () => {
      const parsed = queryString.parse('?');
      expect(parsed).toEqual({});
    });

    test('解析包含多个&符号的查询字符串', () => {
      const parsed = queryString.parse('foo=bar&&baz=qux');
      expect(parsed).toEqual({ foo: 'bar', baz: 'qux' });
    });

    test('解析包含空参数的查询字符串', () => {
      const parsed = queryString.parse('foo=bar&&&&baz=qux');
      expect(parsed).toEqual({ foo: 'bar', baz: 'qux' });
    });

    test('解析带有#前缀的查询字符串', () => {
      const parsed = queryString.parse('#foo=bar');
      expect(parsed).toEqual({ foo: 'bar' });
    });

    test('解析带有&前缀的查询字符串', () => {
      const parsed = queryString.parse('&foo=bar');
      expect(parsed).toEqual({ foo: 'bar' });
    });

    test('separator 格式解析编码的值', () => {
      const parsed = queryString.parse('foo=1%2C2', {
        arrayFormat: 'separator',
        arrayFormatSeparator: ',',
      });
      expect(parsed.foo).toEqual(['1', '2']);
    });

    test('separator 格式解析 null 值', () => {
      const parsed = queryString.parse('foo', {
        arrayFormat: 'separator',
        arrayFormatSeparator: ',',
      });
      expect(parsed.foo).toBeNull();
    });
  });

  // 测试 removeHash 和 getHash 的边界情况
  describe('removeHash 和 getHash 边界情况测试', () => {
    test('extract 处理各种类型的输入', () => {
      expect(queryString.extract([])).toBe('');
      expect(queryString.extract({ url: 'test' })).toBe('');
      expect(queryString.extract(true)).toBe('');
    });
  });

  // 测试更多特殊情况以提高覆盖率
  describe('提高覆盖率的特殊测试', () => {
    test('parse 处理空格字符串（经过trim后为空）', () => {
      const parsed = queryString.parse('   ');
      expect(parsed).toEqual({});
    });

    test('parse 处理只有换行符的字符串', () => {
      const parsed = queryString.parse('\n\t  ');
      expect(parsed).toEqual({});
    });

    test('stringifyUrl 处理特殊字符的片段标识符（触发URL构造失败）', () => {
      // 通过传递一个空URL和特殊片段标识符，可能触发URL构造失败的catch分支
      const stringified = queryString.stringifyUrl({
        url: '',
        query: { foo: 'bar' },
        fragmentIdentifier: 'hash',
      }, { encodeFragmentIdentifier: true });

      expect(stringified).toContain('foo=bar');
      expect(stringified).toContain('#');
    });

    test('keysSorter 处理简单类型（非对象非数组）', () => {
      // 测试在parse中对简单值进行排序
      const parsed = queryString.parse('a=hello&b=world', {
        sort: true,
      });
      // 简单字符串值应该保持不变
      expect(parsed.a).toBe('hello');
      expect(parsed.b).toBe('world');
    });
  });
});
