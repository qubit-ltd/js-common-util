////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * 从指定的HTML元素的类列表中删除指定的CSS类。
 *
 * @param {HTMLElement} el
 *     指定的HTML元素对象。
 * @param {String} cls
 *     待删除的CSS类名；可以是多个类名，用空格隔开。
 * @author 胡海星
 */
function removeClassFromHtmlElement(el, cls) {
  if (!el || !cls) {
    return;
  }

  const classes = cls.split(/\s+/).filter((c) => c.length > 0);
  if (classes.length === 0) {
    return;
  }

  if (el.classList) {
    // 如果元素支持classList API，直接使用它
    for (let i = 0; i < classes.length; ++i) {
      const clsName = classes[i];
      if (clsName) {
        el.classList.remove(clsName);
      }
    }
  } else {
    // 对于不支持classList的元素，模拟classList.remove行为

    // 获取当前元素的类名字符串，去掉首尾空格
    const currentClassStr = el.className.trim();
    if (!currentClassStr) {
      return; // 如果没有类名，不需要任何操作
    }

    // 将类名字符串分割成数组
    const currentClasses = currentClassStr.split(/\s+/);

    // 处理每个要删除的类名
    for (let i = 0; i < classes.length; ++i) {
      const classToRemove = classes[i];
      // 查找类名在数组中的位置
      const index = currentClasses.indexOf(classToRemove);
      // 如果找到了，就从数组中删除
      if (index !== -1) {
        currentClasses.splice(index, 1);
      }
    }

    // 将剩余的类名重新组合成字符串，赋值给className
    el.className = currentClasses.join(' ');
  }
}

/**
 * 从指定的HTML元素的类列表中删除指定的CSS类。
 *
 * @param {HTMLElement} el
 *     指定的HTML元素对象。
 * @param {String} cls
 *     待删除的CSS类名；可以是多个类名，用空格隔开。
 * @deprecated 请使用 `removeClassFromHtmlElement`。
 * @author 胡海星
 */
function removeClassFromHmlElement(el, cls) {
  removeClassFromHtmlElement(el, cls);
}

export {
  removeClassFromHtmlElement,
  removeClassFromHmlElement,
};

export default removeClassFromHtmlElement;
