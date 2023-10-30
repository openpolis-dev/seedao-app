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
    {
      name: 'resources.calendar',
      link: 'https://tally.so/r/mKxkWD',
      id: 'calendar',
      icon: '',
      desc: 'Add events in community calendar.',
    },
    {
      name: 'resources.brand',
      link: 'https://tally.so/r/w4QxNd',
      id: 'brand',
      icon: '',
      desc: 'Use SeeDAO branding resources.',
    },
    {
      name: 'resources.community',
      link: 'https://tally.so/r/mBp09R',
      id: 'community',
      icon: '',
      desc: 'Share your idea in community weekly conf.',
    },
    {
      name: 'Home.pub',
      link: 'https://tally.so/r/mDKbqb',
      id: 'community',
      icon: '',
      desc: 'The events hub for SeeDAO community.',
    },
  ],
  applyAppLink: 'https://tally.so/r/3XozzP',
  governance: [
    {
      name: 'city-hall.communityReview',
      link: 'https://tally.so/forms/mBp09R/submissions',
      id: 'community',
      icon: '',
      desc: 'Review the request of sharing in community weekly conf.',
    },
    {
      name: 'city-hall.CalendarReview',
      link: 'https://tally.so/r/mKxkWD/submissions',
      id: 'calendar',
      icon: '',
      desc: 'Review the request of adding events in community calendar.',
    },
    {
      name: 'city-hall.AppReview',
      link: 'https://tally.so/forms/3XozzP/submissions',
      id: 'app',
      icon: '',
      desc: 'Review the request of adding apps in SeeDAO App.',
    },
    {
      name: 'Home.pub',
      link: 'https://www.notion.so/ab122e6e19f14ff5a212fb6e77d5b366?v=34760c2c81e648549f5a40a79dc3b198&pvs=4',
      id: 'app',
      icon: '',
      desc: 'The events hub for SeeDAO community.',
    },
  ],
  brand: [
    {
      name: 'city-hall.brandReview',
      link: 'https://tally.so/forms/w4QxNd/submissions',
      id: 'brand',
      icon: '',
      desc: 'Review the request of using SeeDAO branding resources.',
    },
  ],
  apps: [
    {
      id: 'Deschool',
      name: 'Deschool',
      link: 'https://deschool.app/origin/plaza',
      icon: DeschoolIcon,
      desc: 'DeSchool is building education infrastructure in Web3.',
    },
    {
      id: 'AAAny',
      name: 'AAAny',
      link: 'https://apps.apple.com/ca/app/aaany-ask-anyone-anything/id6450619356',
      icon: AaanyIcon,
      desc: 'AAAny wants everyone to enjoy AMA. We offers a wealth of exclusive features to make your AMA experience joyful and efficient.',
    },
    {
      id: 'Cascad3',
      name: 'Cascad3',
      link: 'https://www.cascad3.com/',
      icon: Cascad3Icon,
      desc: 'Co-create everything. Find your creative community.',
    },
    {
      id: 'DAOLink',
      name: 'DAOLink',
      link: 'https://app.daolink.space',
      icon: DaolinkIcon,
      desc: 'DAOLink is a web3 cowork platform perfect for DAOs, remote teams, and digital nomads.',
    },
    {
      id: 'Wormhole3',
      name: 'Wormhole3',
      link: 'https://alpha.wormhole3.io',
      icon: Wormhole3Icon,
      desc: 'A Wormhole From Web2 to Web3.',
    },
    {
      id: 'Metaforo',
      name: 'Metaforo',
      link: 'https://www.metaforo.io',
      icon: MetaforoIcon,
      desc: 'Decisions get made by members, for members. Metaforo is the only community platform that supports quorum and quadratic token voting.',
    },
    {
      id: 'pub',
      name: 'Home.pub',
      link: 'https://seeu.network/',
      icon: '',
      desc: 'The events hub for SeeDAO community.',
    },
    // {
    //   id: 'online',
    //   name: 'Home.OnlineEvent',
    //   link: 'https://calendar.google.com/calendar/u/0?cid=c2VlZGFvLnRlY2hAZ21haWwuY29t',
    //   icon: <Calendar />,
    //   desc: '',
    // },
    // {
    //   id: 'offline',
    //   name: 'Home.OfflineEvent',
    //   link: 'https://seeu.network/',
    //   icon: <Grid1x2 />,
    //   desc: '',
    // },
  ],
};
