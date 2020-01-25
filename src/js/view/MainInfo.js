import BaseView from './BaseView';
import EventsNames from '../events/index';
import { DateFormatter, DOM } from '../utils/index';

export default class MainInfo extends BaseView {
  constructor() {
    super('main');
  }

  init = () => {
    this.render();
    this.initEvents();
    this.updateTime();
  };

  normalizeWeatherList(list) {
    const itemsForOneDay = 8;
    return list.reduce((acc, weather, index) => {
      if (index % itemsForOneDay !== 0) return acc;

      return [...acc, weather];
    }, []);
  }

  render = () => {
    const whetherInfo = super.getFromLS('whetherInfo');
    const text = super.getFromLS('text');

    const {
      city: { name },
      list,
    } = whetherInfo;
    const weatherList = this.normalizeWeatherList(list);
    const temperatureList = `
      <h1 class="main-info__title">${name}</h1>
      <p class="main-info__date">
        <time class="main-info__date-date"
          >${DateFormatter.currentDay()}</time
        >
        <time class="main-info__date-time">${DateFormatter.currentTime()}</time>
      </p>

      <ul class="temperature-list">
      ${weatherList
      .map((item, index) => {
        const {
          main,
          weather,
          wind,
          // eslint-disable-next-line camelcase
          dt_txt,
        } = item;
        if (index === 0) {
          return `<li class="temperature-list__item temperature-list__item--today">
                      <p class="temperature-list__item-info">
                        <span class="temperature-list__item-degree">${Math.round(
            main.temp,
          )}°</span>
                        <span class="temperature-list__item-icon"><i class="owf owf-${
                          weather[0].id
                        } owf-10x"></i></span> 
                      </p>

                      <div class="temperature-list__item-info-additional">
                        <p>${text.humidity}: ${main.humidity}°</p>
                        <p>${text.pressure}: ${main.pressure}</p>
                        <p>${text.windSpeed}: ${Math.round(wind.speed)}</p>
                        <p>${text.feelsLike}: ${Math.round(main.feels_like)}</p>
                      </div>
                    </li>`;
        }

        return `<li class="temperature-list__item">
                    <p class="temperature-list__item-info">
                      <time class="temperature-list__item-week">${DateFormatter.normalizeWeek(
          dt_txt,
        )}</time>
                      <span class="temperature-list__item-degree"> ${Math.round(
          main.temp,
        )}°<sup class="temperature-list__item-icon"><i class="owf owf-${
          weather[0].id
        } owf-10x"></i></sup> </span>
                    </p>
                  </li>`;
      })
      .join('\n')}
      </ul>
    `;

    const isMainInfoAlreadyRender = DOM.select(document.body, '.main-info');

    if (isMainInfoAlreadyRender) {
      isMainInfoAlreadyRender.innerHTML = temperatureList;
    } else {
      const [wrapper] = DOM.createElements([{ tag: 'section' }], ['main-info']);
      wrapper.innerHTML = temperatureList;
      DOM.appendElements(this.node, [wrapper]);
      this.isAlreadyRendered = true;
    }
  };

  initEvents() {
    this.listen(EventsNames.LANGUAGE_CHANGED, this.render);
    this.listen(EventsNames.LOCATION_CHANGED, this.render);
    this.listen(EventsNames.TEMPERATURE_UNITS_CHANGED, this.render);
  }

  updateTime() {
    if (!this.timeout) {
      this.timeout = setTimeout(() => {
        // NOTE: move to utils/Date function
        const t = new Date();
        const minute = t.getMinutes();
        const hours = t.getHours();
        const seconds = t.getSeconds();

        const normalize = `${hours < 10 ? `0${hours}` : hours}:${
          minute < 10 ? `0${minute}` : minute
        }:${seconds < 10 ? `0${seconds}` : seconds}`;

        this.node.querySelector(
          '.main-info__date-time',
        ).textContent = normalize;

        this.timeout = null;
        this.updateTime();
      }, 500);
    }
  }
}
