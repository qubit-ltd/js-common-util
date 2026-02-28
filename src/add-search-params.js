////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import queryString from './query-string';
import getSearch from './get-search';
import getHash from './get-hash';

/**
 * Add a parameter to the query string of the current address. Note that the
 * added parameter will be URL encoded.
 *
 * Because the addresses of Vue.js are all in hash form for routing, the basic
 * `window.location.search` cannot be used to obtain the ocrrect query string.
 * For example: `http://dev.example.com/test/#/finish?params=xxx`.
 *
 * @param {Object} params
 *     Each attribute name and attribute value of this argument will be added
 *     to the query string of the current address as a key-value pair.
 * @param {String|URL} url
 *     An optional argument, indicating the URL address to be parsed, as a
 *     `String` or `URL` object. If this argument is missing, `window.location`
 *     is used.
 * @returns {String}
 *     A new link address with the specified parameters added and properly
 *     regularized.
 * @author Haixing Hu
 */
/**
 * Add a parameter to the query string of the current address. Note that the
 * added parameter will be URL encoded.
 *
 * Because the addresses of Vue.js are all in hash form for routing, the basic
 * `window.location.search` cannot be used to obtain the correct query string.
 * For example: `http://dev.example.com/test/#/finish?params=xxx`.
 *
 * @param {Object} params
 *     Each attribute name and attribute value of this argument will be added
 *     to the query string of the current address as a key-value pair.
 * @param {String|URL} url
 *     An optional argument, indicating the URL address to be parsed, as a
 *     `String` or `URL` object. If this argument is missing, `window.location`
 *     is used.
 * @returns {String}
 *     A new link address with the specified parameters added and properly
 *     regularized.
 * @author Haixing Hu
 */
function addSearchParams(params, url) {
  let theUrl;
  if (url === undefined) {
    theUrl = window.location;
  } else if (url instanceof URL) {
    theUrl = url;
  } else {
    try {
      theUrl = new URL(url);
    } catch (_e) {
      // if the URL is invalid, fall back to window.location
      theUrl = window.location;
    }
  }
  const base = theUrl.origin + theUrl.pathname;
  const hashPart = getHash(theUrl);
  const hash = (hashPart === null ? '' : `#${hashPart}`);
  const kv = queryString.stringify(params);
  let search = getSearch(theUrl);
  if (search !== null && search.length > 0) {
    search = `${search}&${kv}`;
  } else {
    search = kv;
  }
  return `${base}?${search}${hash}`;
}

export default addSearchParams;
