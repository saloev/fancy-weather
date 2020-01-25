/**
 * simple PubSub pattern
 * @based on @see https://css-tricks.com/build-a-state-management-system-with-vanilla-javascript/
 */

export default class PubSub {
  // store for events and subscribers
  #events = new Map();

  /**
   * subscribe to event with callback
   * @param {String} event
   * @param {Function} callback
   */
  subscribe = (event, callback, context) => {
    if (!this.#events.has(event)) {
      this.#events.set(event, []);
    }

    const subscribers = this.#events.get(event);
    subscribers.push(context ? callback.bind(context) : callback);
  }

  /**
   * Trigger event and pass given data
   * @param {String} event
   * @param {Any} data
   */
  publish(event, data = {}) {
    const eventsSubscribers = this.#events.get(event);

    if (!eventsSubscribers) {
      console.warn(`Not subscribers found for event ${event}`);
      return;
    }

    // eslint-disable-next-line consistent-return
    eventsSubscribers.map((subscriber) => subscriber(data));
  }

  /**
   * Unsubscribe callback from event
   * @param {String} event
   * @param {Function} callback
   */
  unsubscribe = (event, callback) => {
    const eventsSubscribers = this.#events.get(event);

    if (!eventsSubscribers) {
      console.warn(`Not subscribers found for event ${event}`);
      return;
    }

    const isCallbackInEvent = eventsSubscribers.includes(callback);
    if (!isCallbackInEvent) {
      console.warn(`There is not such subscriber ${callback}`);
      return;
    }

    const filterSubscribers = eventsSubscribers.filter((subscriber) => subscriber !== callback);
    this.#events.set(event, filterSubscribers);
  }
}
