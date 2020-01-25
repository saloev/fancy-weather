import BaseView from './BaseView';
import { DOM } from '../utils/index';
import EventsName from '../events/index';

export default class Map extends BaseView {
  constructor() {
    super('main');

    super.listen(EventsName.LANGUAGE_CHANGED, this.changeText);
  }

  init() {
    const text = super.getFromLS('text');
    const {
      city: { coord },
    } = super.getFromLS('whetherInfo');

    const location = `
    <div id="map"></div>
    <ul class="location-info">
      <li>
        <p>${text.lat.toUpperCase()}: ${coord.lat}</p>
      </li>
      <li>
        <p>${text.lon.toUpperCase()}: ${coord.lon}</p>
      </li>
    </ul>`;

    const wrapper = DOM.createElements([{ tag: 'div' }], ['location']);
    wrapper[0].innerHTML = location;
    DOM.appendElements(this.node, wrapper);
  }

  changeText() {
    const text = super.getFromLS('text');
    const {
      city: { coord },
    } = super.getFromLS('whetherInfo');

    const latAndLan = DOM.select(this.node, '.location-info li p', true);
    latAndLan.forEach((elem, index) => {
      const latOrLan = index === 0 ? 'lat' : 'lon';
      // eslint-disable-next-line no-param-reassign
      elem.textContent = `${text[latOrLan].toUpperCase()}: ${coord[latOrLan]}`;
    });
  }
}
