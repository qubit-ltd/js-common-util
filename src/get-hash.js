////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * 获取当前地址的hash.
 *
 * 因为Vue.js的地址都是hash形式做路由，所以可能存在形如下面的hash和search组合：
 * http://dev.example.com/test/#/finish?params=xxx
 *
 * @param {String|URL} url
 *     字符串或URL对象，可选参数。表示待解析的URL地址。若无此参数则使用
 *     window.location.href。
 * @return {String}
 *     URL地址中的hash，不包含#，也不解析其中的参数，也不对URL编码的参数进行解
 *     码。若不存在hash（即不存在#），则返回null. 注意返回的hash可能为空字符串。
 * @author 胡海星
 */
function getHash(url) {
  if (url === undefined) {
    url = window.location;
  } else if (!(url instanceof URL)) {
    try {
      url = new URL(url);
    } catch (_e) {
      // 如果URL无效，回退到window.location
      url = window.location;
    }
  }

  // 确保url不为undefined
  if (!url) {
    return null;
  }

  let hash = url.hash;
  if (hash.length === 0) {
    // work around for a special case: http://www.baidu.com/?source=xxx#
    const href = url.href;
    if (href && href.length > 0 && href.charAt(href.length - 1) === '#') {
      return '';
    }
    return null;
  }
  // 去除开头的 #
  hash = hash.substring(1);
  // 去除hash中的?后面的query string参数
  const pos = hash.indexOf('?');
  if (pos >= 0) {
    hash = hash.substring(0, pos);
  }
  return hash;
}

export default getHash;
