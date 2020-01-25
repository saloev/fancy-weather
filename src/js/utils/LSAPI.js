/**
 * @classdesc Basic local storage API
 * @class
 */
export default class LSAPI {
  /**
   * @param {String} key
   * @param {Any} value
   */
  static setItem(key, value) {
    localStorage.setItem(key, this.toStr(value));
  }

  /**
   *
   * @param {String} key
   */
  static getItem(key) {
    return this.parseStr(localStorage.getItem(key));
  }

  /**
   *
   * @param {String} key
   */
  static clearItem(key) {
    localStorage.removeItem(key);
  }

  static clear() {
    localStorage.clear();
  }

  /**
   *
   * @param {Any} value
   * @returns {String}
   */
  static toStr(value) {
    return JSON.stringify(value);
  }

  /**
   *
   * @param {String} value
   * @returns {Any}
   */
  static parseStr(value) {
    return JSON.parse(value);
  }
}
