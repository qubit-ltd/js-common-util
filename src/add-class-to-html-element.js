////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import isHtmlElementHasClass from './is-html-element-has-class';

/**
 * Adds CSS classes to the specified HTML element.
 *
 * @param {HTMLElement} el
 *     The specified HTML element object.
 * @param {String} cls
 *     The name of the CSS class to be added; it can be multiple class names,
 *     separated by spaces.
 * @author Haixing Hu
 */
function addClassToHtmlElement(el, cls) {
  if (!el || !cls) {
    return;
  }
  const classes = cls.split(/\s+/);
  if (el.classList) {
    for (let i = 0; i < classes.length; ++i) {
      const clsName = classes[i];
      if (clsName) {
        el.classList.add(clsName);
      }
    }
  } else {
    let currentClass = el.className || '';
    for (let i = 0; i < classes.length; ++i) {
      const clsName = classes[i];
      if (clsName && !isHtmlElementHasClass(el, clsName)) {
        currentClass += (currentClass ? ' ' : '') + clsName;
      }
    }
    el.className = currentClass;
  }
}

/**
 * Adds CSS classes to the specified HTML element.
 *
 * @param {HTMLElement} el
 *     The specified HTML element object.
 * @param {String} cls
 *     The name of the CSS class to be added; it can be multiple class names,
 *     separated by spaces.
 * @deprecated Use `addClassToHtmlElement` instead.
 * @author Haixing Hu
 */
function addClassToHmlElement(el, cls) {
  addClassToHtmlElement(el, cls);
}

export {
  addClassToHtmlElement,
  addClassToHmlElement,
};

export default addClassToHtmlElement;
