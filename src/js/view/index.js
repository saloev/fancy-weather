import EventsName, { globalEvents as reactiveData } from '../events/index';

import BaseLayout from './BaseLayout';
import ControlBlock from './TopHeader';
import APILoader from './APIRequestProgressLoader';
import MainInfo from './MainInfo';
import Map from './Map';
import Loader from './Loader';

export default () => {
  const components = [
    {
      component: Loader,
      waitUntilDataLoaded: false,
    },
    {
      component: APILoader,
      waitUntilDataLoaded: false,
    },
    {
      component: BaseLayout,
      waitUntilDataLoaded: false,
    },
    {
      component: MainInfo,
      waitUntilDataLoaded: true,
    },
    {
      component: Map,
      waitUntilDataLoaded: true,
    },
    {
      component: ControlBlock,
      waitUntilDataLoaded: true,
    }];

  components.forEach(({ component: Component, waitUntilDataLoaded }) => {
    if (waitUntilDataLoaded) {
      reactiveData.subscribe(
        EventsName.APPLICATION_READY, () => {
          const newComponent = new Component();
          newComponent.init();
        },
      );
    } else { const newComponent = new Component(); newComponent.init(); }
  });
};
