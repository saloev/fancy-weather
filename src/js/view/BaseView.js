import { Event, DOM, LSAPI } from '../utils/index';

import { globalEvents as reactiveData } from '../events/index';

/**
 * Render HTML to given element
 */
export default class BaseView {
  /**
   *
   * @param {String} appendTo any valid css selector
   */
  constructor(appendTo, to = document.body) {
    this.node = DOM.select(to, `${appendTo}`);
    if (!this.node) {
      throw Error(`DOM element not found by selector ${appendTo}`);
    }

    this.setGlobalData();
  }

  /**
   *
   * @param {String} elemSelector any valid css selector
   */
  select(elemSelector) {
    const node = DOM.select(document.body, elemSelector);

    if (!node) {
      throw Error(`Element not found by selector ${elemSelector}`);
    }

    return node;
  }

  /**
   * Call function for specific event
   * @param {String} name event name
   * @param {Function} func
   */
  listen(name, func) {
    reactiveData.subscribe(name, func, this);
  }


  /**
   * dispatch event and send data
   * @param {String} name
   * @param {any} data
   */
  commit(name, data) {
    reactiveData.publish(name, data);
  }

  /**
   * Save data to Local Storage
   * @param {String} key updated key data of LS
   * @param {Any} newData new data
   * @param {String} from updated LS object
   */
  updateLS(key, newData, from = 'GLOBAL_DATA') {
    const value = LSAPI.getItem(from) || {};
    const newValue = { ...value, [key]: newData };
    LSAPI.setItem(from, newValue);
  }

  /**
   *
   * @param {String} key
   * @param {String} from
   */
  getFromLS(key, from = 'GLOBAL_DATA') {
    const value = LSAPI.getItem(from) || {};
    return value[key];
  }

  /**
   *
   * @param {Array{String}} events
   * @param {Array{Functions}} funcs
   * @param {DOMElement} to
   */
  bindEvents(events, funcs, to = this.node) {
    events.forEach((event, index) => {
      Event.listen(event, funcs[index], to);
    });
  }

  /**
   * Render HTML string to node
   * @param {String} html
   */
  render(html) {
    DOM.renderHTML(this.node, html);
  }

  setGlobalData() {
    const data = LSAPI.getItem('GLOBAL_DATA');
    if (!data) {
      throw Error('Global data not saved in LS');
    }
    this.data = data;
  }
}
