////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import splitOnFirst from './split-on-first';
import isUndefinedOrNull from './is-undefined-or-null';
import uriEncode from './uri-encode';
import uriDecode from './uri-decode';
import includeKeys from './include-keys';

// 以下代码改造自 https://github.com/sindresorhus/query-string

// the following symbols are used to identify the options
const encodeFragmentIdentifier = Symbol('encodeFragmentIdentifier');

/**
 * 检查值是否应该被跳过处理
 * @param {*} value - 要检查的值
 * @param {Object} options - 配置选项
 * @returns {boolean} 如果值应该被跳过则返回true
 */
function shouldSkip(value, options) {
  return value === undefined
    || (options.skipNull && value === null)
    || (options.skipEmptyString && value === '');
}

/**
 * 根据选项对值进行编码
 * @param {string} value - 要编码的值
 * @param {Object} options - 编码选项
 * @returns {string} 编码后的值
 */
function encode(value, options) {
  if (options.encode) {
    return options.strict ? uriEncode(value) : encodeURIComponent(value);
  }
  return value;
}

/**
 * 根据选项对值进行解码
 * @param {string} value - 要解码的值
 * @param {Object} options - 解码选项
 * @returns {string} 解码后的值
 */
function decode(value, options) {
  if (options.decode) {
    return uriDecode(value);
  }
  return value;
}

/**
 * 为不同的数组格式创建编码器函数
 * @param {Object} options - 配置选项
 * @returns {Function} 适用于特定数组格式的编码器函数
 */
function encoderForArrayFormat(options) {
  switch (options.arrayFormat) {
    case 'index': {
      return (key) => (result, value) => {
        const index = result.length;
        if (shouldSkip(value, options)) {
          return result;
        }
        if (value === null) {
          return [
            ...result, [encode(key, options), '[', index, ']'].join(''),
          ];
        }
        return [
          ...result,
          [encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join(''),
        ];
      };
    }
    case 'bracket': {
      return (key) => (result, value) => {
        if (shouldSkip(value, options)) {
          return result;
        }
        if (value === null) {
          return [
            ...result,
            [encode(key, options), '[]'].join(''),
          ];
        }
        return [
          ...result,
          [encode(key, options), '[]=', encode(value, options)].join(''),
        ];
      };
    }
    case 'colon-list-separator': {
      return (key) => (result, value) => {
        if (shouldSkip(value, options)) {
          return result;
        }
        if (value === null) {
          return [
            ...result,
            [encode(key, options), ':list='].join(''),
          ];
        }
        return [
          ...result,
          [encode(key, options), ':list=', encode(value, options)].join(''),
        ];
      };
    }

    case 'comma':
    case 'separator':
    case 'bracket-separator': {
      const keyValueSeparator = (options.arrayFormat === 'bracket-separator') ? '[]=' : '=';
      return (key) => (result, value) => {
        if (shouldSkip(value, options)) {
          return result;
        }
        // 将null转换为空字符串，避免序列化为'null'
        const processedValue = value === null ? '' : value;
        if (result.length === 0) {
          return [[encode(key, options), keyValueSeparator, encode(processedValue, options)].join('')];
        }
        return [[result, encode(processedValue, options)].join(options.arrayFormatSeparator)];
      };
    }

    default: {
      return (key) => (result, value) => {
        if (shouldSkip(value, options)) {
          return result;
        }

        if (value === null) {
          return [
            ...result,
            encode(key, options),
          ];
        }

        return [
          ...result,
          [encode(key, options), '=', encode(value, options)].join(''),
        ];
      };
    }
  }
}

/**
 * 为不同的数组格式创建解析器函数
 * @param {Object} options - 配置选项
 * @returns {Function} 适用于特定数组格式的解析器函数
 */
function parserForArrayFormat(options) {
  switch (options.arrayFormat) {
    case 'index': {
      return (key, value, accumulator) => {
        const result = /\[(\d*)]$/.exec(key);
        const cleanKey = key.replace(/\[\d*]$/, '');

        if (!result) {
          accumulator[cleanKey] = value;
          return;
        }

        if (accumulator[cleanKey] === undefined) {
          accumulator[cleanKey] = {};
        }

        accumulator[cleanKey][result[1]] = value;
      };
    }

    case 'bracket': {
      return (key, value, accumulator) => {
        const result = /(\[])$/.exec(key);
        const cleanKey = key.replace(/\[]$/, '');

        if (!result) {
          accumulator[cleanKey] = value;
          return;
        }

        if (accumulator[cleanKey] === undefined) {
          accumulator[cleanKey] = [value];
          return;
        }

        accumulator[cleanKey] = [...accumulator[cleanKey], value];
      };
    }

    case 'colon-list-separator': {
      return (key, value, accumulator) => {
        const result = /(:list)$/.exec(key);
        const cleanKey = key.replace(/:list$/, '');

        if (!result) {
          accumulator[cleanKey] = value;
          return;
        }

        if (accumulator[cleanKey] === undefined) {
          accumulator[cleanKey] = [value];
          return;
        }

        accumulator[cleanKey] = [...accumulator[cleanKey], value];
      };
    }

    case 'comma':
    case 'separator': {
      return (key, value, accumulator) => {
        if (typeof value !== 'string') {
          accumulator[key] = value;
          return;
        }

        const isArray = value.includes(options.arrayFormatSeparator);
        const isEncodedArray = !isArray && decode(value, options).includes(options.arrayFormatSeparator);
        const valueToProcess = isEncodedArray ? decode(value, options) : value;

        let newValue;
        if (isArray || isEncodedArray) {
          newValue = valueToProcess.split(options.arrayFormatSeparator).map((item) => decode(item, options));
        } else {
          newValue = value === null ? value : decode(value, options);
        }

        accumulator[key] = newValue;
      };
    }

    case 'bracket-separator': {
      return (key, value, accumulator) => {
        const isArray = /(\[])$/.test(key);
        const cleanKey = key.replace(/\[]$/, '');

        if (!isArray) {
          accumulator[cleanKey] = value ? decode(value, options) : value;
          return;
        }

        const arrayValue = value === null
          ? []
          : decode(value, options).split(options.arrayFormatSeparator);

        if (accumulator[cleanKey] === undefined) {
          accumulator[cleanKey] = arrayValue;
          return;
        }

        accumulator[cleanKey] = [...accumulator[cleanKey], ...arrayValue];
      };
    }

    default: {
      return (key, value, accumulator) => {
        if (accumulator[key] === undefined) {
          accumulator[key] = value;
          return;
        }

        // 确保始终使用数组包装已存在的值
        const existingValue = accumulator[key];
        accumulator[key] = Array.isArray(existingValue)
          ? [...existingValue, value]
          : [existingValue, value];
      };
    }
  }
}

/**
 * 验证数组格式分隔符是否有效
 * @param {string} value - 要验证的分隔符
 * @throws {TypeError} 如果分隔符不是单个字符的字符串
 */
function validateArrayFormatSeparator(value) {
  if (typeof value !== 'string' || value.length !== 1) {
    throw new TypeError('arrayFormatSeparator must be single character string');
  }
}

/**
 * 对输入对象的键进行排序
 * @param {*} input - 要排序的对象或数组
 * @returns {*} 排序后的结果
 */
function keysSorter(input) {
  if (Array.isArray(input)) {
    return [...input].sort();
  }

  if (input && typeof input === 'object' && input !== null) {
    // 修复：先获取所有键，然后按数字排序，然后映射为值
    return Object.keys(input)
      .sort((a, b) => Number(a) - Number(b))
      .map((key) => input[key]);
  }

  return input;
}

/**
 * 移除URL中的哈希部分
 * @param {string} input - 输入URL
 * @returns {string} 移除哈希后的URL
 */
function removeHash(input) {
  if (typeof input !== 'string') {
    return '';
  }

  const hashStart = input.indexOf('#');
  return hashStart !== -1 ? input.slice(0, hashStart) : input;
}

/**
 * 获取URL中的哈希部分
 * @param {string} url - 输入URL
 * @returns {string} URL的哈希部分
 */
function getHash(url) {
  if (typeof url !== 'string') {
    return '';
  }

  const hashStart = url.indexOf('#');
  return hashStart !== -1 ? url.slice(hashStart) : '';
}

/**
 * 根据选项和类型解析值
 * @param {*} value - 要解析的值
 * @param {Object} options - 解析选项
 * @param {string|Function} type - 目标类型或转换函数
 * @returns {*} 解析后的值
 */
function parseValue(value, options, type) {
  // 当值为null时，直接返回
  if (value === null) {
    return null;
  }

  // 处理字符串类型
  if (type === 'string' && typeof value === 'string') {
    return value;
  }

  // 处理自定义转换函数
  if (typeof type === 'function' && typeof value === 'string') {
    try {
      return type(value);
    } catch (error) {
      // 如果转换失败，返回原始值
      console.error(`类型转换失败: ${error.message}`);
      return value;
    }
  }

  // 处理布尔值
  if (options.parseBooleans
      && typeof value === 'string'
      && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
    return value.toLowerCase() === 'true';
  }

  // 处理数字类型
  const isValidNumberString = typeof value === 'string' && value.trim() !== '';
  if ((type === 'number' || options.parseNumbers)
      && isValidNumberString
      && !Number.isNaN(Number(value))) {
    return Number(value);
  }

  return value;
}

/**
 * 从URL中提取查询字符串部分
 * @param {string} input - 输入URL
 * @returns {string} 提取的查询字符串
 */
function extract(input) {
  if (typeof input !== 'string') {
    return '';
  }

  const withoutHash = removeHash(input);
  const queryStart = withoutHash.indexOf('?');

  return queryStart === -1 ? '' : withoutHash.slice(queryStart + 1);
}

/**
 * 解析查询字符串为对象
 * @param {string} query - 要解析的查询字符串
 * @param {Object} options - 解析选项
 * @returns {Object} 解析后的对象
 */
function parse(query, options = {}) {
  // 合并默认选项
  options = {
    decode: true,
    sort: true,
    arrayFormat: 'none',
    arrayFormatSeparator: ',',
    parseNumbers: false,
    parseBooleans: false,
    types: Object.create(null),
    ...options,
  };

  validateArrayFormatSeparator(options.arrayFormatSeparator);

  const formatter = parserForArrayFormat(options);

  // 创建一个没有原型的对象
  const returnValue = Object.create(null);

  // 如果查询不是字符串或为空，返回空对象
  if (typeof query !== 'string' || !query.trim()) {
    return returnValue;
  }

  // 清理查询字符串
  const cleanQuery = query.trim().replace(/^[?#&]/, '');
  if (!cleanQuery) {
    return returnValue;
  }

  // 解析每个参数
  for (const parameter of cleanQuery.split('&')) {
    if (parameter === '') {
      continue;
    }

    // 处理 '+' 为空格（如果需要解码）
    const parameter_ = options.decode ? parameter.replaceAll('+', ' ') : parameter;

    // 分割键值对
    const [keyPart, value] = splitOnFirst(parameter_, '=');

    // 如果没有键，使用整个参数作为键
    let key = keyPart;
    if (key === undefined) {
      key = parameter_;
    }

    // 缺少 `=` 应该是 `null`:
    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    let finalValue;
    if (value === undefined) {
      finalValue = null;
    } else if (['comma', 'separator', 'bracket-separator'].includes(options.arrayFormat)) {
      finalValue = value;
    } else {
      finalValue = decode(value, options);
    }

    // 使用格式化器处理键值对
    formatter(decode(key, options), finalValue, returnValue);
  }

  // 对值进行类型转换
  for (const [key, value] of Object.entries(returnValue)) {
    if (typeof value === 'object' && value !== null && options.types[key] !== 'string') {
      // 处理嵌套对象
      for (const [key2, value2] of Object.entries(value)) {
        const type = options.types[key] ? options.types[key].replace('[]', '') : undefined;
        value[key2] = parseValue(value2, options, type);
      }
    } else if (typeof value === 'object' && value !== null && options.types[key] === 'string') {
      // 将对象值转换为字符串
      returnValue[key] = Object.values(value).join(options.arrayFormatSeparator);
    } else {
      // 直接转换值
      returnValue[key] = parseValue(value, options, options.types[key]);
    }
  }

  // 如果不需要排序，直接返回结果
  if (options.sort === false) {
    return returnValue;
  }

  // 根据选项排序键
  return (options.sort === true
    ? Object.keys(returnValue).sort() // 默认字母排序
    : Object.keys(returnValue).sort(options.sort) // 自定义排序函数
  ).reduce((result, key) => {
    const value = returnValue[key];
    // 如果值是非数组对象，对其键进行排序
    result[key] = Boolean(value) && typeof value === 'object' && !Array.isArray(value)
      ? keysSorter(value)
      : value;
    return result;
  }, Object.create(null));
}

/**
 * 将对象序列化为查询字符串
 * @param {Object} object - 要序列化的对象
 * @param {Object} options - 序列化选项
 * @returns {string} 序列化后的查询字符串
 */
function stringify(object, options) {
  if (!object) {
    return '';
  }

  // 合并默认选项
  options = {
    encode: true,
    strict: true,
    arrayFormat: 'none',
    arrayFormatSeparator: ',',
    skipNull: false,
    skipEmptyString: false,
    ...options,
  };

  validateArrayFormatSeparator(options.arrayFormatSeparator);

  // 判断是否应该过滤掉某个键
  const shouldFilter = (key) => (
    (options.skipNull && isUndefinedOrNull(object[key]))
    || (options.skipEmptyString && object[key] === '')
  );

  // 获取适合当前数组格式的格式化器
  const formatter = encoderForArrayFormat(options);

  // 创建一个过滤后的对象副本
  const objectCopy = {};
  for (const [key, value] of Object.entries(object)) {
    if (!shouldFilter(key)) {
      objectCopy[key] = value;
    }
  }

  // 获取所有键并可能排序
  const keys = Object.keys(objectCopy);
  if (options.sort !== false) {
    keys.sort(typeof options.sort === 'function' ? options.sort : undefined);
  }

  // 处理每个键值对并构建查询字符串
  return keys.map((key) => {
    const value = object[key];

    // 跳过未定义的值
    if (value === undefined) {
      return '';
    }

    // 处理null值
    if (value === null) {
      return encode(key, options);
    }

    // 处理数组
    if (Array.isArray(value)) {
      // 处理空数组的特殊情况
      if (value.length === 0 && options.arrayFormat === 'bracket-separator') {
        return `${encode(key, options)}[]`;
      }

      // 使用格式化器处理每个数组元素
      return value
        .reduce(formatter(key), [])
        .join('&');
    }

    // 处理其他类型
    return `${encode(key, options)}=${encode(value, options)}`;
  }).filter((x) => x.length > 0).join('&');
}

/**
 * 解析URL并提取其查询参数
 * @param {string} url - 要解析的URL
 * @param {Object} options - 解析选项
 * @returns {Object} 解析后的URL对象，包含url, query和可选的fragmentIdentifier
 */
function parseUrl(url, options = {}) {
  if (typeof url !== 'string') {
    return { url: '', query: {} };
  }

  options = {
    decode: true,
    ...options,
  };

  // 分割URL和哈希部分
  const [urlPartOriginal, hash] = splitOnFirst(url, '#');

  // 如果URL部分未定义，使用整个URL
  let urlPart = urlPartOriginal;
  if (urlPart === undefined) {
    urlPart = url;
  }

  // 提取基本URL和查询参数
  const baseUrl = urlPart?.split('?')?.[0] ?? '';
  const query = parse(extract(url), options);

  // 构造结果对象
  const result = {
    url: baseUrl,
    query,
  };

  // 如果需要解析片段标识符且存在哈希值，添加到结果
  if (options.parseFragmentIdentifier && hash) {
    result.fragmentIdentifier = decode(hash, options);
  }

  return result;
}

/**
 * 将URL对象转换为URL字符串
 * @param {Object} object - URL对象，包含url, query和可选的fragmentIdentifier
 * @param {Object} options - 转换选项
 * @returns {string} 构建的URL
 */
function stringifyUrl(object, options = {}) {
  // 验证输入
  if (!object || typeof object !== 'object') {
    return '';
  }

  // 合并默认选项
  options = {
    encode: true,
    strict: true,
    [encodeFragmentIdentifier]: true,
    ...options,
  };

  // 提取基本URL
  const url = object.url ? removeHash(object.url).split('?')[0] || '' : '';

  // 从URL中提取查询参数
  const queryFromUrl = extract(object.url || '');

  // 合并查询参数
  const query = {
    ...parse(queryFromUrl, { sort: false }),
    ...object.query,
  };

  // 构建查询字符串部分
  let queryString = stringify(query, options);
  if (queryString) {
    queryString = `?${queryString}`;
  }

  // 处理哈希部分
  let hash = getHash(object.url || '');
  if (typeof object.fragmentIdentifier === 'string') {
    try {
      // 使用URL API处理片段标识符编码
      const urlObjectForFragmentEncode = new URL(url || 'http://example.com');
      urlObjectForFragmentEncode.hash = object.fragmentIdentifier;
      hash = options[encodeFragmentIdentifier]
        ? urlObjectForFragmentEncode.hash
        : `#${object.fragmentIdentifier}`;
    } catch (_error) {
      // 如果URL构造失败，使用简单方法
      hash = options[encodeFragmentIdentifier]
        ? `#${encodeURIComponent(object.fragmentIdentifier)}`
        : `#${object.fragmentIdentifier}`;
    }
  }

  return `${url}${queryString}${hash}`;
}

/**
 * 从URL中选择指定的查询参数
 * @param {string} input - 输入URL
 * @param {Array|Function} filter - 参数过滤器，可以是键名数组或函数
 * @param {Object} options - 选择选项
 * @returns {string} 构建的URL，只包含选中的参数
 */
function pick(input, filter, options = {}) {
  if (typeof input !== 'string' || !filter) {
    return '';
  }

  options = {
    parseFragmentIdentifier: true,
    [encodeFragmentIdentifier]: false,
    ...options,
  };

  const { url, query, fragmentIdentifier } = parseUrl(input, options);

  return stringifyUrl({
    url,
    query: includeKeys(query, filter),
    fragmentIdentifier,
  }, options);
}

/**
 * 从URL中排除指定的查询参数
 * @param {string} input - 输入URL
 * @param {Array|Function} filter - 要排除的参数过滤器，可以是键名数组或函数
 * @param {Object} options - 排除选项
 * @returns {string} 构建的URL，不包含被排除的参数
 */
function exclude(input, filter, options = {}) {
  if (typeof input !== 'string' || !filter) {
    return '';
  }

  const exclusionFilter = Array.isArray(filter)
    ? (key) => !filter.includes(key)
    : (key, value) => !filter(key, value);

  return pick(input, exclusionFilter, options);
}

// 导出所有功能
export default {
  extract,
  parse,
  stringify,
  parseUrl,
  stringifyUrl,
  pick,
  exclude,
};
