import BaseView from './BaseView';
import { DOM } from '../utils/index';
import EventsName from '../events/index';

export default class APIRequestProgressLoader extends BaseView {
  constructor() {
    super('#app');
  }

  init() {
    [this.loader] = DOM.createElements([{ tag: 'div' }], ['api-loader']);

    DOM.appendElements(this.node.parentElement, [this.loader]);
    super.listen(EventsName.API_REQUEST, this.setPercentage);
  }

  setPercentage = (data) => {
    // const calculateTranstionX = 100 - data;
    this.loader.style.transform = `translateX(${100 - data}%)`;
    this.loader.style.opacity = '1';

    if (data !== 100) return;

    if (!this.hideLoader) {
      this.hideLoader = setTimeout(() => {
        this.loader.style.transform = 'translateX(-100%)';
        this.loader.style.opacity = '0';
        this.hideLoader = null;
      }, 1500);
    }
  }
}
