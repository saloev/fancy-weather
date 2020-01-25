import libs from './libs/index';
import view from './view/index';

export default () => {
  // load html
  view();

  // load libs
  libs();
};
