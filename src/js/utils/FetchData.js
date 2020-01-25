import {
  API_ACCESS_KEY_UNSPLASH, API_LOCATION_KEY, API_OPENWEATHERMAP_KEY, API_YANDEX_TRANSLATE_KEY,
} from '../config/config';
import EventsName, { globalEvents as reactiveData } from '../events/index';

import LSAPI from './LSAPI';
import DateFormatter from './DateFormatter';

function progress(percentage) {
  return () => {
    reactiveData.publish(EventsName.API_REQUEST, percentage);
  };
}

/**
 * @based on @see https://learn.javascript.ru/fetch-progress and @see https://dev.to/samthor/progress-indicator-with-fetch-1loo
 *
 * Common fetch function
 *
 * @param {String} url
 * @returns {any}
 */
async function fetchDataAsync(url) {
  // Шаг 1: начинаем загрузку fetch, получаем поток для чтения
  const response = await fetch(`${url}`);

  const reader = response.body.getReader();

  // Шаг 2: получаем длину содержимого ответа
  const contentLength = +response.headers.get('Content-Length');

  // Шаг 3: считываем данные:
  let receivedLength = 0; // количество байт, полученных на данный момент
  const chunks = []; // массив полученных двоичных фрагментов (составляющих тело ответа)

  for (;;) {
    // eslint-disable-next-line no-await-in-loop
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    chunks.push(value);
    receivedLength += value.length;

    if (contentLength) {
      progress((receivedLength / contentLength) * 100)();
    }
  }

  // Шаг 4: соединим фрагменты в общий типизированный массив Uint8Array
  const chunksAll = new Uint8Array(receivedLength);
  let position = 0;
  chunks.forEach((chunk) => {
    chunksAll.set(chunk, position);
    position += chunk.length;
  });

  // Шаг 5: декодируем Uint8Array обратно в строку
  const result = new TextDecoder('utf-8').decode(chunksAll);

  return JSON.parse(result);
}

export default {
  location() {
    const url = `https://ipinfo.io/json?token=${API_LOCATION_KEY}`;
    return fetchDataAsync(url);
  },

  whether(locationName, language) {
    let cityName = locationName;
    const { whetherInfo, currentLanguage, temperatureUnit } = LSAPI.getItem('GLOBAL_DATA');

    if (!cityName) {
      if (!whetherInfo) {
        const { locationInfo: { city } } = LSAPI.getItem('GLOBAL_DATA');
        cityName = city;
      } else {
        cityName = whetherInfo.city.name;
      }
    }


    const dispatchtemperature = {
      F: 'imperial', // openweathermap for temperature in Fahrenheit use units=imperial
      C: 'metric', // openweathermap For temperature in Celsius use units=metric
    };

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&lang=${language || currentLanguage}&units=${dispatchtemperature[temperatureUnit]}&APPID=${API_OPENWEATHERMAP_KEY}`;
    return fetchDataAsync(url);
  },

  photo() {
    const { whetherInfo } = LSAPI.getItem('GLOBAL_DATA');
    const { city, list } = whetherInfo;

    // sunset in ms 1578397875
    const { sunset, name } = city;

    const [info] = list;
    const { weather } = info;
    const [describe] = weather;
    // today wheater info for example 'Rain'
    const { main } = describe;


    // 1578397875773 => 1578397875
    const currentTime = +`${new Date().getTime()}`.slice(0, -3);
    const isNight = currentTime >= sunset;

    const month = DateFormatter.month();

    const query = `town,${name},${!isNight ? 'daytime' : 'night-time'},${main},${month}`;
    const url = `https://api.unsplash.com/photos/random?query=${query}&client_id=${API_ACCESS_KEY_UNSPLASH}`;
    return fetchDataAsync(url);
  },

  translate(previousLanguage = 'en') {
    const { text, currentLanguage } = LSAPI.getItem('GLOBAL_DATA');
    const translateFromTo = `${previousLanguage.toLowerCase()}-${currentLanguage.toLowerCase()}`;

    const textKeys = Object.keys(text);
    textKeys.sort();

    const textValues = textKeys.reduce((acc, key) => [...acc, text[key]], []);

    const queryText = textValues.reduce((acc, value) => `${acc}&text=${value}`, '');

    const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${API_YANDEX_TRANSLATE_KEY}${encodeURI(queryText)}&lang=${translateFromTo}`;

    return fetchDataAsync(url);
  },
};
