import './scss/main.scss';

// load main data and save global data to LocalStorage
// eslint-disable-next-line no-unused-vars
import data from './js/data/data';

// load app
import index from './js/index';

const init = () => {
  index();
};

window.addEventListener('DOMContentLoaded', init);
