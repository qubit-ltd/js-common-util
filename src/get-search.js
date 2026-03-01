////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Get the query string of the specified URL.
 *
 * Because the addresses of Vue.js are all in hash form for routing, the basic
 * `window.location.search` cannot be used to obtain the correct query string.
 * For example: `http://dev.example.com/test/#/finish?params=xxx`
 *
 * @param {String|URL} url
 *     Optional, indicating the URL address to be parsed. If this argument is
 *     not provided, the `window.location.href` will be used.
 * @return {String}
 *     The query string in the URL address, which does not contain `?`, nor parsed,
 *     and the URL-encoded parameters are not decoded. If the query string
 *     parameter does not exist, null is returned.
 * @author Haixing Hu
 */
function getSearch(url = undefined) {
  let theUrl;
  if (url === undefined) {
    theUrl = window.location;
  } else if (url instanceof URL) {
    theUrl = url;
  } else {
    try {
      theUrl = new URL(url);
    } catch (_e) {
      // 如果URL无效，回退到window.location
      theUrl = window.location;
    }
  }
  const search = theUrl.search;
  let result = null;
  if (search) {
    // 去除开头的 ?
    result = search.substring(1);
  }
  // 从 hash 中获取参数
  const hash = theUrl.hash;
  const pos = hash.indexOf('?');
  if (pos > -1) {
    result = (result ? `${result}&` : '') + hash.substring(pos + 1);
  }
  return result;
}

export default getSearch;
