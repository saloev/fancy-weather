import { DOM } from '../utils/index';
import EventsName, { globalEvents as reactiveData } from '../events/index';

export default class Loader {
  #animationDelayTime = 1200;

  #currentActiveIndex = -1;

  #animationTimeout = null;

  #animationID = null;


  init() {
    [this.wrapper] = DOM.createElements([{ tag: 'div' }], ['custom-loader']);
    this.wrapper.innerHTML = `
    <ul class="custom-loader__list reset-list-style">
    <li class="custom-loader__list-item"><i class="owf owf-202 owf-10x"></i></li>
    <li class="custom-loader__list-item"><i class="owf owf-302 owf-10x"></i></li>
    <li class="custom-loader__list-item"><i class="owf owf-502 owf-10x"></i></li>
    <li class="custom-loader__list-item"><i class="owf owf-602 owf-10x"></i></li>
  </ul>`;

    DOM.appendElements(document.body, [this.wrapper]);

    this.iconListItems = this.wrapper.querySelectorAll('li');

    this.#toggleElementVisibility();
    this.#animationID = requestAnimationFrame(this.startAnimation);

    reactiveData.subscribe(EventsName.APPLICATION_READY, this.stopAnimation);
  }

  startAnimation = () => {
    if (!this.#animationTimeout) {
      this.#animationTimeout = setTimeout(this.#toggleElementVisibility, this.#animationDelayTime);
    }
    this.#animationID = requestAnimationFrame(this.startAnimation);
  }

  stopAnimation = () => {
    this.wrapper.classList.add('hide');
    cancelAnimationFrame(this.#animationID);
    if (!this.timeoutForLoader) {
      this.timeoutForLoader = setTimeout(() => {
        this.wrapper.remove();
        this.timeoutForLoader = null;
      }, 3000);
    }
  }

  #toggleElementVisibility = () => {
    this.#currentActiveIndex = this.#currentActiveIndex > this.iconListItems.length - 2
      ? 0 : this.#currentActiveIndex + 1;
    this.iconListItems.forEach((item, index) => {
      if (index !== this.#currentActiveIndex) {
        item.classList.add('hide');
        item.classList.remove('show');
      } else {
        item.classList.add('show');
        item.classList.remove('hide');
      }
    });
    this.#animationTimeout = null;
  }
}
