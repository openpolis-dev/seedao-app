import { Calendar, Boxes, Receipt, Postcard, Grid1x2, CashCoin } from 'react-bootstrap-icons';
// NOTE: choose icon from the library: https://icons.getbootstrap.com/
import { AppIcon } from 'components/common/appCard';
// Apps
import MetaforoIcon from '../assets/Imgs/home/Metaforo.png';
import AaanyIcon from '../assets/Imgs/home/AAAny.png';
import DeschoolIcon from '../assets/Imgs/home/Deschool.png';
import DaolinkIcon from '../assets/Imgs/home/DAOlink.png';
import Cascad3Icon from '../assets/Imgs/home/Cascad3.png';
import Wormhole3Icon from '../assets/Imgs/home/Wormhole3.png';

export default {
  seed: 'https://seed.seedao.xyz/',
  resource: [
    { name: 'resources.calendar', link: 'https://tally.so/r/mKxkWD', id: 'calendar', icon: <Calendar /> },
    { name: 'resources.brand', link: 'https://tally.so/r/w4QxNd', id: 'brand', icon: <Postcard /> },
    { name: 'resources.community', link: 'https://tally.so/r/mBp09R', id: 'community', icon: <Receipt /> },
  ],
  applyAppLink: 'https://tally.so/r/3XozzP',
  governance: [
    {
      name: 'city-hall.communityReview',
      link: 'https://tally.so/forms/mBp09R/submissions',
      id: 'community',
      icon: <Receipt />,
    },
    {
      name: 'city-hall.CalendarReview',
      link: 'https://tally.so/r/mKxkWD/submissions',
      id: 'calendar',
      icon: <Calendar />,
    },
    {
      name: 'city-hall.AppReview',
      link: 'https://tally.so/forms/3XozzP/submissions',
      id: 'app',
      icon: <Boxes />,
    },
  ],
  brand: [
    {
      name: 'city-hall.brandReview',
      link: 'https://tally.so/forms/w4QxNd/submissions',
      id: 'brand',
      icon: <Postcard />,
    },
  ],
  apps: [
    {
      id: 'Deschool',
      name: 'Deschool',
      link: 'https://deschool.app/origin/plaza',
      icon: DeschoolIcon,
      desc: '',
    },
    {
      id: 'AAAny',
      name: 'AAAny',
      link: 'https://apps.apple.com/ca/app/aaany-ask-anyone-anything/id6450619356',
      icon: AaanyIcon,
      desc: '',
    },
    {
      id: 'Cascad3',
      name: 'Cascad3',
      link: 'https://www.cascad3.com/',
      icon: Cascad3Icon,
      desc: '',
    },
    {
      id: 'DAOLink',
      name: 'DAOLink',
      link: 'https://app.daolink.space',
      icon: DaolinkIcon,
      desc: '',
    },
    {
      id: 'Wormhole3',
      name: 'Wormhole3',
      link: 'https://alpha.wormhole3.io',
      icon: Wormhole3Icon,
      desc: '',
    },
    {
      id: 'Metaforo',
      name: 'Metaforo',
      link: 'https://www.metaforo.io',
      icon: MetaforoIcon,
      desc: '',
    },
    {
      id: 'online',
      name: 'Home.OnlineEvent',
      link: 'https://calendar.google.com/calendar/u/0?cid=c2VlZGFvLnRlY2hAZ21haWwuY29t',
      icon: <Calendar />,
      desc: '',
    },
    {
      id: 'offline',
      name: 'Home.OfflineEvent',
      link: 'https://seeu.network/',
      icon: <Grid1x2 />,
      desc: '',
    },
    {
      id: 'pub',
      name: 'Home.pub',
      link: 'https://seeu.network/',
      icon: <CashCoin />,
      desc: '',
    },
  ],
};
