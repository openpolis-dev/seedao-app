// Apps
import MetaforoIcon from '../assets/Imgs/home/Metaforo.png';
import AaanyIcon from '../assets/Imgs/home/AAAny.png';
import DeschoolIcon from '../assets/Imgs/home/Deschool.png';
import DaolinkIcon from '../assets/Imgs/home/DAOlink.png';
import Cascad3Icon from '../assets/Imgs/home/Cascad3.png';
import Wormhole3Icon from '../assets/Imgs/home/Wormhole3.png';
import SeedIcon from '../assets/images/seed.png';
import SeeUImg from '../assets/Imgs/home/seeuNetwork.jpg';

import RImg1 from '../assets/Imgs/resources/1.png';
import RImg2 from '../assets/Imgs/resources/2.png';
import RImg3 from '../assets/Imgs/resources/3.png';
import RImg4 from '../assets/Imgs/resources/4.png';
import RImg5 from '../assets/Imgs/resources/5.png';
import RImg6 from '../assets/Imgs/resources/6.png';
import RImg7 from '../assets/Imgs/resources/7.png';
import RImg8 from '../assets/Imgs/resources/8.png';
import RImg9 from '../assets/Imgs/resources/9.png';
import RImg10 from '../assets/Imgs/resources/10.png';
import RImg11 from '../assets/Imgs/resources/11.png';
import RImg12 from '../assets/Imgs/resources/12.png';

/**
 * NOTE:
 * if id starts with "module-", means its path is our app's router path, otherwise is outer link
 */

const links = {
  resource: [
    {
      name: 'resources.calendar',
      link: 'https://tally.so/r/mKxkWD',
      id: 'calendar',
      icon: RImg1,
      desc: 'resources.CalendarReviewDesc',
    },
    {
      name: 'resources.community',
      link: 'https://tally.so/r/mBp09R',
      id: 'community',
      icon: RImg2,
      desc: 'resources.communityDesc',
    },
    {
      name: 'resources.Pub',
      link: 'https://tally.so/r/mDKbqb',
      id: 'community',
      icon: RImg3,
      desc: 'resources.PubDesc',
    },
    {
      name: 'resources.Media',
      link: 'https://tally.so/r/wzMRBE',
      id: 'Media',
      icon: RImg4,
      desc: 'resources.MediaDesc',
    },
    {
      name: 'resources.App',
      link: 'https://tally.so/r/3XozzP',
      id: 'Apps',
      icon: RImg5,
      desc: 'resources.AppDesc',
    },
    {
      name: 'resources.Project',
      link: 'https://tally.so/r/w2AWlp',
      id: 'Projects',
      icon: RImg6,
      desc: 'resources.ProjectDesc',
    },
    {
      name: 'resources.Guild',
      link: 'https://tally.so/r/3NXjRW',
      id: 'Guilds',
      icon: RImg7,
      desc: 'resources.GuildDesc',
    },
    {
      name: 'resources.Incubator',
      link: 'https://tally.so/r/wAr0Q0',
      id: 'Apps',
      icon: RImg8,
      desc: 'resources.IncubatorDesc',
    },
    {
      name: 'resources.Seed',
      link: 'https://seed.seedao.xyz/',
      id: 'Seed',
      icon: SeedIcon,
      desc: 'resources.SeedDesc',
    },
  ],
  applyAppLink: 'https://tally.so/r/3XozzP',
  governance: [
    {
      name: 'city-hall.CommunityReview',
      link: 'https://tally.so/forms/mBp09R/submissions',
      id: 'community',
      icon: RImg9,
      desc: 'city-hall.CommunityReviewDesc',
    },
    {
      name: 'city-hall.MediaReview',
      link: 'https://tally.so/forms/wzMRBE/submissions',
      id: 'community',
      icon: RImg10,
      desc: 'city-hall.MediaReviewDesc',
    },
    {
      name: 'city-hall.CalendarReview',
      link: 'https://tally.so/r/mKxkWD/submissions',
      id: 'calendar',
      icon: RImg11,
      desc: 'city-hall.CalendarReviewDesc',
    },
    {
      name: 'city-hall.AppReview',
      link: 'https://tally.so/forms/3XozzP/submissions',
      id: 'app',
      icon: RImg12,
      desc: 'city-hall.AppReviewDesc',
    },
    {
      name: 'city-hall.ProjectReview',
      link: 'https://tally.so/forms/w2AWlp/submissions',
      id: 'project',
      icon: RImg5,
      desc: 'city-hall.ProjectReviewDesc',
    },
    {
      name: 'city-hall.GuildReview',
      link: 'https://tally.so/forms/3NXjRW/submissions',
      id: 'guild',
      icon: RImg1,
      desc: 'city-hall.GuildReviewDesc',
    },
    {
      name: 'city-hall.PubReview',
      link: 'https://www.notion.so/ab122e6e19f14ff5a212fb6e77d5b366?v=34760c2c81e648549f5a40a79dc3b198&pvs=4',
      id: 'community',
      icon: RImg3,
      desc: 'city-hall.PubReviewDesc',
    },
    {
      name: 'city-hall.GovernanceNodeResult',
      link: '/city-hall/governance/governance-node-result',
      id: 'module-governance-node-result',
      icon: RImg3, // TODO
      desc: 'city-hall.GovernanceNodeResultDesc',
    },
  ],
  brand: [
    // {
    //   name: 'city-hall.BrandReview',
    //   link: 'https://tally.so/forms/w4QxNd/submissions',
    //   id: 'brand',
    //   icon: '',
    //   desc: 'city-hall.BrandReviewDesc',
    // },
    {
      name: 'city-hall.MediaReview',
      link: 'https://tally.so/forms/wzMRBE/submissions',
      id: 'media',
      icon: RImg4,
      desc: 'city-hall.MediaReviewDesc',
    },
  ],
  tech: [
    {
      name: 'city-hall.SeedReview',
      link: '',
      id: 'seed',
      icon: RImg5,
      desc: 'city-hall.SeedReviewDesc',
    },
  ],
  apps: [
    {
      id: 'Deschool',
      name: 'Deschool',
      link: 'https://deschool.app/origin/plaza',
      icon: DeschoolIcon,
      desc: 'apps.DeschoolDesc',
    },
    {
      id: 'AAAny',
      name: 'AAAny',
      link: 'https://apps.apple.com/ca/app/aaany-ask-anyone-anything/id6450619356',
      icon: AaanyIcon,
      desc: 'apps.AAAnyDesc',
    },
    {
      id: 'Cascad3',
      name: 'Cascad3',
      link: 'https://www.cascad3.com/',
      icon: Cascad3Icon,
      desc: 'apps.Cascad3Desc',
    },
    {
      id: 'DAOLink',
      name: 'DAOLink',
      link: 'https://app.daolink.space',
      icon: DaolinkIcon,
      desc: 'apps.DAOLinkDesc',
    },
    {
      id: 'Wormhole3',
      name: 'Wormhole3',
      link: 'https://alpha.wormhole3.io',
      icon: Wormhole3Icon,
      desc: 'apps.Wormhole3Desc',
    },
    {
      id: 'Metaforo',
      name: 'Metaforo',
      link: 'https://forum.seedao.xyz/',
      icon: MetaforoIcon,
      desc: 'apps.MetaforoDesc',
    },
    {
      id: 'module-pub',
      name: 'apps.Pub',
      link: '/pub',
      icon: '',
      desc: 'apps.PubDesc',
    },
    // {
    //   id: 'online',
    //   name: 'Home.OnlineEvent',
    //   link: 'https://calendar.google.com/calendar/u/0?cid=c2VlZGFvLnRlY2hAZ21haWwuY29t',
    //   icon: <Calendar />,
    //   desc: '',
    // },
    {
      id: 'seeu',
      name: 'apps.SeeU',
      link: 'https://seeu.network/',
      icon: SeeUImg,
      desc: 'apps.SeeUDesc',
    },
  ],
};

export default links;
