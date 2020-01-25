import fontawsome from './fontawsome';
import Map from './Map';

import EventsName, { globalEvents as reactiveData } from '../events/index';

export default () => {
  fontawsome();

  const map = new Map();

  reactiveData.subscribe(EventsName.LANGUAGE_CHANGED, map.init, map);
  reactiveData.subscribe(EventsName.LOCATION_CHANGED, map.init, map);
  reactiveData.subscribe(EventsName.APPLICATION_READY, map.init, map);
};
