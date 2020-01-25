import BaseView from './BaseView';
import EventsNames from '../events/index';
import { FetchData, LSAPI } from '../utils';

export default class TopHeader extends BaseView {
  constructor() {
    super('header');
  }

  init = () => {
    const {
      currentLanguage,
      temperatureUnit,
      languages,
      text: { searchPlaceHolder },
    } = LSAPI.getItem('GLOBAL_DATA');
    const controlBlockHtml = `
    <ul class="control-block">
      <li class="control-block__item">
        <button class="control-block__btn button is-info is-medium">
          <span class="icon">
            <i class="fas fa-sync"></i>
          </span>
        </button>
      </li>
      <li class="control-block__item">
        <div class="control has-icons-left">
          <div class="select is-medium is-info has-text-dark">
            <select>
              ${languages
      .map((element) => {
        if (element === currentLanguage) {
          return `<option selected>${element.toUpperCase()}</option>`;
        }

        return `<option>${element.toUpperCase()}</option>`;
      })
      .join('\n')}
            </select>
          </div>
          <span class="icon is-medium is-left has-text-dark">
            <i class="fas fa-language"></i>
          </span>
        </div>
      </li>
      <li class="control-block__item">
        <div class="control has-icons-left">
          <div class="select is-medium is-info has-text-dark">
            <select>
              <option ${temperatureUnit === 'C' ? 'selected' : ''}>C</option>
              <option ${temperatureUnit === 'F' ? 'selected' : ''}>F</option>
            </select>
          </div>
          <span class="icon is-medium is-left has-text-dark">
            <i class="fas fa-temperature-high"></i>
          </span>
        </div>
      </li>
    </ul>`;

    const searchHtml = `
    <div class="search">
      <form class="search-form">
        <div class="field has-addons">
          <div class="control has-icons-left has-icons-right is-medium">
            <input
              class="input is-info is-medium "
              type="text"
              placeholder="${searchPlaceHolder}"
              value=""
              name="search"
            />
            <span class="icon is-small is-left">
              <i class="fas fa-search-location"></i>
            </span>
          </div>
          <div class="control">
            <button class="button is-info is-medium" type="submit">Search</button>
          </div>
        </div>
      </form>
    </div>`;

    const concatHtml = controlBlockHtml + searchHtml;
    super.render(concatHtml);
    this.initEvents();
  };

  selectChange = ({ target }) => {
    const { value } = target;

    const previousLanguage = super.getFromLS('currentLanguage');
    const text = super.getFromLS('text');

    const dispatchValue = {
      F: 'F',
      C: 'C',
      BE: 'be',
      RU: 'ru',
      EN: 'en',
    };

    const updatedDataKey = value === 'F' || value === 'C' ? 'temperatureUnit' : 'currentLanguage';
    this.updateLS(updatedDataKey, dispatchValue[value]);

    if (updatedDataKey !== 'currentLanguage') {
      return this.commit(EventsNames.CHANGE_TEMPERATURE_UNITS);
    }

    return FetchData.translate(previousLanguage)
      .then((res) => {
        const textKeys = Object.keys(text);
        textKeys.sort();

        const translatedText = res.text;
        textKeys.forEach((key, index) => {
          text[key] = translatedText[index];
        });

        super.updateLS('text', text);

        this.commit(EventsNames.LANGUAGE_CHANGED);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  updateImage = ({ target }) => {
    const btn = target.closest('button');
    if (target.tagName !== 'BUTTON' && !btn) return;

    this.commit(EventsNames.UPDATE_IMAGE);
  };

  changeLocation = (e) => {
    e.preventDefault();
    const { target } = e;
    const formData = new FormData(target);
    const input = formData.get('search');
    const currentLanguage = super.getFromLS('currentLanguage');
    this.commit(EventsNames.CHANGE_LOCATION, { city: input, currentLanguage });
  };

  initEvents = () => {
    try {
      const tools = this.select('.control-block');
      this.bindEvents(['change'], [this.selectChange], tools);

      const changePhotoBtn = this.select('.control-block__btn');
      this.bindEvents(['click'], [this.updateImage], changePhotoBtn);

      const form = this.select('.search-form');
      this.bindEvents(['submit'], [this.changeLocation], form);
    } catch (e) {
      console.error(e);
    }
  };
}
