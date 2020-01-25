
import { FetchData } from '../utils/index';
import EventsName from '../events/index';

import BaseView from './BaseView';

export default class BaseLayout extends BaseView {
  constructor() {
    super('#app');
  }

  init = () => {
    this.initEvents();

    super.render(`
    <div class="main-layout">
      <header class="header"></header>
      <main class="main"></main>
    </div>`);
  }

  initEvents = () => {
    // first fetch data from API
    this.apiData();

    super.listen(EventsName.UPDATE_IMAGE, this.fetchAndChangePhoto);
    super.listen(EventsName.LANGUAGE_CHANGED, this.fetchAndChangeLocation);
    super.listen(EventsName.CHANGE_LOCATION, this.fetchAndChangeLocation);
    super.listen(EventsName.CHANGE_TEMPERATURE_UNITS, this.changeTemperatureUnits);

    setTimeout(() => {
      this.fetchAndChangeLocation();
    }, 5 * 1000 * 60);
  }

  async apiData() {
    try {
      const locationInfo = await FetchData.location();
      this.updateLS('locationInfo', locationInfo);

      const { city } = locationInfo;
      const currentLanguage = super.getFromLS('currentLanguage');

      const whetherInfo = await FetchData.whether(city, currentLanguage);
      this.changeLocation(whetherInfo);

      const photoInfo = await FetchData.photo();
      this.changePhoto(photoInfo);
      this.commit(EventsName.APPLICATION_READY);
    } catch (e) {
      console.error(e);
      this.commit(EventsName.APPLICATION_READY);
    }
  }

  /**
   * Change location
   * @param {Object} data;
   */
  async fetchAndChangeLocation(data) {
    try {
      const { city, currentLanguage } = data;
      const whetherInfo = await FetchData.whether(city, currentLanguage);
      this.changeLocation(whetherInfo);

      const photoInfo = await FetchData.photo();
      this.changePhoto(photoInfo);

      this.commit(EventsName.LOCATION_CHANGED);
    } catch (e) {
      // Rate Limit Exceeded
      if (e.message === 'Unexpected token R in JSON at position 0') {
        const { city, currentLanguage } = data;
        const whetherInfo = await FetchData.whether(city, currentLanguage);
        this.changeLocation(whetherInfo);
        this.commit(EventsName.LOCATION_CHANGED);
      }
      console.error(e, e.message);
    }
  }


  /**
   * Fetch and change background photo
   */
  async fetchAndChangePhoto() {
    try {
      const res = await FetchData.photo();
      this.changePhoto(res);
    } catch (e) {
      // Rate Limit Exceeded
      console.error(e);
    }
  }

  /**
   * change temperature units
   * @param {*}
   */
  async changeTemperatureUnits() {
    try {
      const { city: { name } } = super.getFromLS('whetherInfo');
      const currentLanguage = super.getFromLS('currentLanguage');
      const whetherInfo = await FetchData.whether(name, currentLanguage);
      this.changeLocation(whetherInfo);

      this.commit(EventsName.TEMPERATURE_UNITS_CHANGED);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   *
   * @param {Object} data
   */
  changePhoto(data) {
    const { urls: { full } } = data;
    const { documentElement } = document;
    documentElement.style.setProperty('--js-background-image-url', `url("${full}")`);
  }

  /**
   *
   * @param {Object} data
   */
  changeLocation(data) {
    if (data.cod === '404') {
      throw Error('City not found');
    }

    this.updateLS('whetherInfo', data);
  }
}
