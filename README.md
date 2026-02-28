# @qubit-ltd/common-util

[![npm package](https://img.shields.io/npm/v/@qubit-ltd/common-util.svg)](https://npmjs.com/package/@qubit-ltd/common-util)
[![License](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![中文文档](https://img.shields.io/badge/文档-中文版-blue.svg)](README.zh_CN.md)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/Haixing-Hu/js-common-util/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/Haixing-Hu/js-common-util/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/Haixing-Hu/js-common-util/badge.svg?branch=master)](https://coveralls.io/github/Haixing-Hu/js-common-util?branch=master)

[@qubit-ltd/common-util] is a JavaScript ES6 library of common utility functions that simplifies everyday development tasks. This library provides a comprehensive collection of helper functions for string manipulation, object property access, data type checking, browser detection, DOM manipulation, and more.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
  - [String Manipulation](#string-manipulation)
  - [Object and Property Handling](#object-and-property-handling)
  - [Type Checking](#type-checking)
  - [Browser and Environment Detection](#browser-and-environment-detection)
  - [DOM Manipulation](#dom-manipulation)
  - [Date and Time Formatting](#date-and-time-formatting)
  - [URL and Query String Handling](#url-and-query-string-handling)
  - [Miscellaneous Utilities](#miscellaneous-utilities)
- [Contributing](#contributing)
- [License](#license)

## <span id="installation">Installation</span>

You can install [@qubit-ltd/common-util] via npm or yarn:

```bash
# Using npm
npm install @qubit-ltd/common-util

# Using yarn
yarn add @qubit-ltd/common-util
```

## <span id="usage">Usage</span>

```javascript
// Import specific functions
import { isEmpty, formatLocalDate, jsonStringify } from '@qubit-ltd/common-util';

// Check if a value is empty
const empty = isEmpty('');  // true

// Format a date
const date = new Date();
const formattedDate = formatLocalDate(date);  // e.g., '2023-05-21'

// Stringify a JSON object with circular references
const obj = { a: 1 };
obj.self = obj;  // Circular reference
const json = jsonStringify(obj);  // Handles circular references
```

## <span id="features">Features</span>

### <span id="string-manipulation">String Manipulation</span>

- `trimString`: Trims whitespace from a string
- `uppercaseString`: Converts a string to uppercase
- `trimUppercaseString`: Trims and uppercases a string
- `dequote`: Removes quotes from a string
- `toString`: Converts a value to its string representation, handling circular references in objects
- `format`: Simple string formatting utility
- `splitOnFirst`: Splits a string into two parts at the first occurrence of the specified separator

### <span id="object-and-property-handling">Object and Property Handling</span>

- `getProperty`: Safely gets a property from an object using dot notation
- `setProperty`: Sets a property on an object using dot notation
- `hasProperty`: Checks if an object has a property using dot notation
- `decycle`: Removes circular references from an object
- `includeKeys`: Filters object keys and values into a new object using a predicate or array/set of keys to include
- `excludeKeys`: Filters object keys and values into a new object using a predicate or array/set of keys to exclude
- `ArrayUtils`: Collection of array utility functions including `remove` and `removeIf`

### <span id="type-checking">Type Checking</span>

- `isEmpty`: Checks if a value is empty
- `isUndefinedOrNull`: Checks if a value is undefined or null
- `isUndefinedOrNullOrEmptyString`: Checks if a value is undefined, null, or an empty string
- `isUndefinedOrNullOrEmptyArray`: Checks if a value is undefined, null, or an empty array
- `checkArgumentType`: Validates the type of a function argument

### <span id="browser-and-environment-detection">Browser and Environment Detection</span>

- `isChrome`, `isFirefox`, `isEdge`, `isIE`, `isSafari`, `isOpera`: Browser detection functions
- `isIos`, `isAndroid`: Mobile operating system detection
- `isWechat`: Detects if running in WeChat environment
- `isMyNanjingApp`: Detects if running in MyNanjing app

### <span id="dom-manipulation">DOM Manipulation</span>

- `addClassToHmlElement`: Adds a CSS class to an HTML element
- `removeClassFromHmlElement`: Removes a CSS class from an HTML element
- `isHtmlElement`: Checks if a value is an HTML element
- `isHtmlElementHasClass`: Checks if an HTML element has a specific class
- `fixScroll`: Fixes scroll issues on mobile devices
- `scrollTo`: Smoothly scrolls to an element or position
- `getAncestorClasses`: Gets an array of CSS classes from an element and its ancestors

### <span id="date-and-time-formatting">Date and Time Formatting</span>

- `createDate`: Creates a date from various input formats
- `formatLocalDate`: Formats a date in the local date format
- `formatLocalTime`: Formats a time in the local time format
- `formatLocalDatetime`: Formats a date and time in the local format

### <span id="url-and-query-string-handling">URL and Query String Handling</span>

- `getSearch`: Gets the search part of a URL
- `getParsedSearch`: Parses the search part of a URL
- `getSearchParam`: Gets a specific search parameter from a URL
- `addSearchParams`: Adds search parameters to a URL
- `removeSearchParam`: Removes a search parameter from a URL
- `normalizeUrl`: Normalizes a URL
- `uriEncode`, `uriDecode`: Encodes/decodes URI components
- `extractOssUrlInfo`: Extracts information from an OSS URL

### <span id="miscellaneous-utilities">Miscellaneous Utilities</span>

- `sleep`: Creates a promise that resolves after a specified time
- `loadScript`: Dynamically loads a script
- `rafThrottle`: Throttles a function using requestAnimationFrame
- `stringToFloat`: Converts a string to a float
- `round`: Rounds a number to a specified precision
- `splitDigits`: Splits a number into digits
- `stringToMoney`: Formats a string as money
- `emptyToNull`: Converts empty values to null
- `restoreVueManaged`: Converts Vue-managed objects back to native objects
- `deepEqual`: Performs a deep equality comparison between two values, supporting ES6 types and circular references

## <span id="contributing">Contributing</span>

If you find any issues or have suggestions for improvements, please feel free
to open an issue or submit a pull request to the [GitHub repository].

## <span id="license">License</span>

[@qubit-ltd/common-util] is distributed under the Apache 2.0 license.
See the [LICENSE](LICENSE) file for more details.

[@qubit-ltd/common-util]: https://npmjs.com/package/@qubit-ltd/common-util
[GitHub repository]: https://github.com/Haixing-Hu/js-common-util
