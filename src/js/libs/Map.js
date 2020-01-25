/* eslint-disable no-new */
/* eslint-disable new-cap */
/* eslint-disable no-undef */
import { API_YANDEX_MAP_KEY } from '../config/config';

import { LSAPI } from '../utils/index';

export default class Map {
  constructor(options = {
    zoom: 7,
  }) {
    this.options = options;
  }

  init() {
    const dispatchLanguage = {
      ru: 'ru_RU',
      en: 'en_US',
      be: 'ru_RU',
    };

    const { currentLanguage, whetherInfo: { city: { coord } } } = LSAPI.getItem('GLOBAL_DATA');
    const lang = dispatchLanguage[currentLanguage];

    const { lat, lon } = coord;
    this.options.center = [lat, lon];

    if (this.script) {
      this.script.remove();
    }

    this.script = document.createElement('script');
    this.script.src = `https://api-maps.yandex.ru/2.1/?apikey=${API_YANDEX_MAP_KEY}&lang=${lang}`;
    this.script.setAttribute('id', 'yandexMap');
    document.body.append(this.script);

    this.script.onload = () => {
      if (ymaps) {
        ymaps.ready(this.initMap);
      }
    };
  }

  initMap = () => {
    if (this.map) {
      this.map.destroy();
    }

    this.map = new ymaps.Map('map', this.options);
  }
}
