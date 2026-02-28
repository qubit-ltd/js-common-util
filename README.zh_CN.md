# @qubit-ltd/common-util

[![npm 包](https://img.shields.io/npm/v/@qubit-ltd/common-util.svg)](https://npmjs.com/package/@qubit-ltd/common-util)
[![许可证](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![English doc](https://img.shields.io/badge/document-English-blue.svg)](README.md)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/Haixing-Hu/js-common-util/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/Haixing-Hu/js-common-util/tree/master)
[![覆盖率状态](https://coveralls.io/repos/github/Haixing-Hu/js-common-util/badge.svg?branch=master)](https://coveralls.io/github/Haixing-Hu/js-common-util?branch=master)

[@qubit-ltd/common-util] 是一个 JavaScript ES6 通用工具函数库，可简化日常开发任务。这个库提供了一系列全面的辅助函数，用于字符串操作、对象属性访问、数据类型检查、浏览器检测、DOM 操作等多种功能。

## 目录

- [安装](#安装)
- [使用](#使用)
- [功能特性](#功能特性)
  - [字符串操作](#字符串操作)
  - [对象和属性处理](#对象和属性处理)
  - [类型检查](#类型检查)
  - [浏览器和环境检测](#浏览器和环境检测)
  - [DOM 操作](#dom-操作)
  - [日期和时间格式化](#日期和时间格式化)
  - [URL 和查询字符串处理](#url-和查询字符串处理)
  - [其他实用工具](#其他实用工具)
- [贡献](#贡献)
- [许可证](#许可证)

## <span id="安装">安装</span>

您可以通过 npm 或 yarn 安装 [@qubit-ltd/common-util]：

```bash
# 使用 npm
npm install @qubit-ltd/common-util

# 使用 yarn
yarn add @qubit-ltd/common-util
```

## <span id="使用">使用</span>

```javascript
// 导入特定函数
import { isEmpty, formatLocalDate, jsonStringify } from '@qubit-ltd/common-util';

// 检查值是否为空
const empty = isEmpty('');  // true

// 格式化日期
const date = new Date();
const formattedDate = formatLocalDate(date);  // 例如: '2023-05-21'

// 将带有循环引用的 JSON 对象转为字符串
const obj = { a: 1 };
obj.self = obj;  // 循环引用
const json = jsonStringify(obj);  // 处理循环引用
```

## <span id="功能特性">功能特性</span>

### <span id="字符串操作">字符串操作</span>

- `trimString`: 去除字符串中的空白
- `uppercaseString`: 将字符串转换为大写
- `trimUppercaseString`: 去除空白并转为大写
- `dequote`: 移除字符串中的引号
- `toString`: 将值转换为字符串表示形式，可自动处理对象的循环引用
- `format`: 简单的字符串格式化工具
- `splitOnFirst`: 在指定分隔符第一次出现的位置将字符串分割成两部分

### <span id="对象和属性处理">对象和属性处理</span>

- `getProperty`: 使用点号表示法安全地获取对象属性
- `setProperty`: 使用点号表示法设置对象属性
- `hasProperty`: 使用点号表示法检查对象是否有特定属性
- `decycle`: 移除对象中的循环引用
- `includeKeys`: 使用谓词函数或键数组/集合过滤对象键值，返回包含指定键的新对象
- `excludeKeys`: 使用谓词函数或键数组/集合过滤对象键值，返回排除指定键的新对象
- `ArrayUtils`: 数组工具函数集合，包括 `remove` 和 `removeIf` 等功能

### <span id="类型检查">类型检查</span>

- `isEmpty`: 检查值是否为空
- `isUndefinedOrNull`: 检查值是否为 undefined 或 null
- `isUndefinedOrNullOrEmptyString`: 检查值是否为 undefined、null 或空字符串
- `isUndefinedOrNullOrEmptyArray`: 检查值是否为 undefined、null 或空数组
- `checkArgumentType`: 验证函数参数的类型

### <span id="浏览器和环境检测">浏览器和环境检测</span>

- `isChrome`, `isFirefox`, `isEdge`, `isIE`, `isSafari`, `isOpera`: 浏览器检测函数
- `isIos`, `isAndroid`: 移动操作系统检测
- `isWechat`: 检测是否在微信环境中运行
- `isMyNanjingApp`: 检测是否在我的南京 App 中运行

### <span id="dom-操作">DOM 操作</span>

- `addClassToHtmlElement`: 向一个HTML元素添加CSS类
- `removeClassFromHtmlElement`: 从一个HTML元素中删除CSS类
- `isHtmlElement`: 检查值是否为 HTML 元素
- `isHtmlElementHasClass`: 检查 HTML 元素是否有特定类
- `fixScroll`: 修复移动设备上的滚动问题
- `scrollTo`: 平滑滚动到元素或位置
- `getAncestorClasses`: 获取元素及其祖先元素的 CSS 类数组

### <span id="日期和时间格式化">日期和时间格式化</span>

- `createDate`: 从各种输入格式创建日期
- `formatLocalDate`: 以本地日期格式格式化日期
- `formatLocalTime`: 以本地时间格式格式化时间
- `formatLocalDatetime`: 以本地格式格式化日期和时间

### <span id="url-和查询字符串处理">URL 和查询字符串处理</span>

- `getSearch`: 获取 URL 的搜索部分
- `getParsedSearch`: 解析 URL 的搜索部分
- `getSearchParam`: 从 URL 获取特定的搜索参数
- `addSearchParams`: 向 URL 添加搜索参数
- `removeSearchParam`: 从 URL 移除搜索参数
- `normalizeUrl`: 规范化 URL
- `uriEncode`, `uriDecode`: 编码/解码 URI 组件
- `extractOssUrlInfo`: 从 OSS URL 提取信息

### <span id="其他实用工具">其他实用工具</span>

- `sleep`: 创建在指定时间后解析的 Promise
- `loadScript`: 动态加载脚本
- `rafThrottle`: 使用 requestAnimationFrame 节流函数
- `stringToFloat`: 将字符串转换为浮点数
- `round`: 将数字舍入到指定精度
- `splitDigits`: 将数字拆分为各个数字
- `stringToMoney`: 将字符串格式化为货币形式
- `emptyToNull`: 将空值转换为 null
- `restoreVueManaged`: 将 Vue 托管的对象转换回原生对象
- `deepEqual`: 对两个值进行深度相等比较，支持 ES6 类型以及递归循环引用

## <span id="贡献">贡献</span>

如果您发现任何问题或有改进建议，请随时在 [GitHub 仓库] 中提出问题或提交拉取请求。

## <span id="许可证">许可证</span>

[@qubit-ltd/common-util] 在 Apache 2.0 许可下分发。
有关更多详细信息，请参阅 [LICENSE](LICENSE) 文件。

[@qubit-ltd/common-util]: https://npmjs.com/package/@qubit-ltd/common-util
[GitHub 仓库]: https://github.com/Haixing-Hu/js-common-util 
