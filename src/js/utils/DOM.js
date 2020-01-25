/**
 * basic API DOM for
 * create, append, select DOM elements
 */
export default class DOM {
  /**
   *
   * @param {HTMLElement} elem
   * @param {String} selector
   * @param {Boolean} all
   */
  static select(elem, selector, all = false) {
    return all ? elem.querySelectorAll(selector) : elem.querySelector(selector);
  }

  /**
   * @param {Array{Object}} tagNames
   * @param {Array{String}} classList
   */
  static createElements(tagNames, classList) {
    return tagNames.reduce((acc, { text, cssClass, tag = 'button' }) => {
      const newAcc = document.createElement(tag);
      classList.forEach((strClass) => {
        newAcc.classList.add(strClass);
      });

      if (text) {
        if (text.includes('&')) {
          newAcc.innerHTML = text;
        } else {
          newAcc.textContent = text;
        }
      }


      if (cssClass) {
        cssClass.forEach((strClass) => {
          newAcc.classList.add(strClass);
        });
      }

      return [...acc, newAcc];
    }, []);
  }

  /**
   *
   * @param {HTMLElement} to
   * @param {Array{HTMLElement}} elements
   *
   */
  static appendElements(to, elements) {
    const fragMent = document.createDocumentFragment();

    elements.forEach((element) => {
      fragMent.appendChild(element);
    });

    to.appendChild(fragMent);
  }

  /**
   * @param {HTMLElement} parentNode
   * @param {HTMLElement} newNode
   * @param {HTMLElement} referenceNode
   */
  insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
  }

  /**
   *
   * @param {HTMLElement} to
   * @param {HTML String} html
   *
   */
  static renderHTML(to, html) {
    // eslint-disable-next-line no-param-reassign
    to.innerHTML = html;
  }
}
