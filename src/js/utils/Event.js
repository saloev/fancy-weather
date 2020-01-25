export default class Event {
  /**
   * @param  {Any} data
   * @param {String} @requires eventName
   * @param {Element} to
   * @param {Boolean} isBubbles
   */
  static create(eventName, data = null, to = document.body, isBubbles = false) {
    to.dispatchEvent(
      new CustomEvent(`${eventName}`, { bubbles: isBubbles, detail: { data } }),
    );
  }

  /**
   *
   * @param {Sting} @requires eventName
   * @param {Function} @requires func
   * @param {Element} to
   */
  static listen(eventName, func, to = document.body) {
    to.addEventListener(`${eventName}`, func);
  }
}
