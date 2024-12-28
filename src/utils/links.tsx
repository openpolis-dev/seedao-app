// Apps
import MetaforoIcon from '../assets/Imgs/home/Metaforo.png';
import AaanyIcon from '../assets/Imgs/home/AAAny.png';
import DeschoolIcon from '../assets/Imgs/home/Deschool.png';
import WikiImg from '../assets/Imgs/home/wiki.png';
import EventImg from '../assets/Imgs/home/event.png';
import HubImg from '../assets/Imgs/home/hub.png';
import CalendarImg from '../assets/Imgs/home/calendar.png';
import DaolinkIcon from '../assets/Imgs/home/DAOlink.png';
import Cascad3Icon from '../assets/Imgs/home/Cascad3.png';
import Wormhole3Icon from '../assets/Imgs/home/Wormhole3.png';
import SeedIcon from '../assets/images/seed.png';
import SeeUImg from '../assets/Imgs/home/seeuNetwork.jpg';
import SNSImg from '../assets/Imgs/home/sns2.jpg';
import EchoImg from '../assets/Imgs/home/echo.svg';
import CreditImg from '../assets/Imgs/home/credit.jpg';
import SNSQueryImg from "../assets/Imgs/snsquery.png"

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

import CreateImg from '../assets/Imgs/governance/create.png';
import GuildImg from '../assets/Imgs/governance/guild.png';
import DistributeImg from '../assets/Imgs/governance/distribute.png';
import NodeImg from '../assets/Imgs/governance/node.png';
import PodcastImg from '../assets/Imgs/podcast.jpeg';
import getConfig from './envCofnig';
import AssistantImg from "../assets/Imgs/governance/assistant.png";

import { baselineSquare,featherText,lunchBox,textSquare } from '@lucide/lab';
import { id } from 'ethers/lib/utils';


/**
 * NOTE:
 * if id starts with "module-", means its path is our app's router path, otherwise is outer link
 */

const links = {
  resource: [
    {
      name: 'resources.calendar',
      link: 'https://tally.so/r/mKxkWD',
      id: 'resource-calendar',
      icon: RImg1,
      desc: 'resources.CalendarReviewDesc',
      hideTitle: 0,
      hiddenFields: [],
    },
    {
      name: 'resources.community',
      link: 'https://tally.so/r/mBp09R',
      id: 'resource-community',
      icon: RImg2,
      desc: 'resources.communityDesc',
      hideTitle: 0,
      hiddenFields: ['name', 'sns', 'wallet'],
    },
    {
      name: 'resources.Pub',
      link: 'https://tally.so/r/mDKbqb',
      id: 'resource-community',
      icon: RImg3,
      desc: 'resources.PubDesc',
      hideTitle: 0,
      hiddenFields: ['name', 'sns', 'wallet', 'seed'],
    },
    {
      name: 'resources.Media',
      link: 'https://tally.so/r/wzMRBE',
      id: 'resource-Media',
      icon: RImg4,
      desc: 'resources.MediaDesc',
      hideTitle: 0,
      hiddenFields: ['name', 'sns', 'wallet'],
    },
    {
      name: 'resources.App',
      link: 'https://tally.so/r/3XozzP',
      id: 'resource-Apps',
      icon: RImg5,
      desc: 'resources.AppDesc',
      hideTitle: 0,
      hiddenFields: ['name', 'sns', 'wallet'],
    },
    {
      name: 'resources.Project',
      link: 'https://tally.so/r/w2AWlp',
      id: 'resource-Projects',
      icon: RImg6,
      desc: 'resources.ProjectDesc',
      hideTitle: 0,
      hiddenFields: ['name', 'sns', 'wallet'],
    },
    {
      name: 'resources.Guild',
      link: 'https://tally.so/r/3NXjRW',
      id: 'resource-Guilds',
      icon: RImg7,
      desc: 'resources.GuildDesc',
      hideTitle: 0,
      hiddenFields: ['name', 'sns', 'wallet'],
    },
    {
      name: 'resources.Incubator',
      link: 'https://tally.so/r/wAr0Q0',
      id: 'resource-Apps',
      icon: RImg8,
      desc: 'resources.IncubatorDesc',
      hideTitle: 0,
      hiddenFields: ['name', 'sns', 'wallet'],
    },
    {
      name: 'resources.externalResources',
      link: 'https://www.wjx.top/vm/QvQmfTy.aspx',
      id: 'outer',
      icon: RImg10,
      desc: 'resources.externalResourcesDesc',
      hideTitle: 0,
      hiddenFields: [],
    },
    {
      name: 'resources.brandApply',
      link: 'https://tally.so/r/w4QxNd',
      id: 'outer',
      icon: RImg9,
      desc: 'resources.brandApplyDesc',
      hideTitle: 0,
      hiddenFields: [],
    },
    // {
    //   name: 'resources.Seed',
    //   link: 'https://seed.seedao.xyz/',
    //   id: 'Seed',
    //   icon: SeedIcon,
    //   desc: 'resources.SeedDesc',
    // },
  ],
  applyAppLink: 'https://tally.so/r/3XozzP',
  governance: [
    // {
    //   name: 'city-hall.MediaReview',
    //   link: 'https://tally.so/forms/wzMRBE/submissions',
    //   id: 'community',
    //   icon: RImg10,
    //   desc: 'city-hall.MediaReviewDesc',
    // },
    {
      name: 'city-hall.CalendarReview',
      link: 'https://tally.so/r/mKxkWD/submissions',
      id: 'calendar',
      icon: RImg11,
      desc: 'city-hall.CalendarReviewDesc',
    },
    {
      name: 'city-hall.PubReview',
      link: 'https://www.notion.so/ab122e6e19f14ff5a212fb6e77d5b366?v=34760c2c81e648549f5a40a79dc3b198&pvs=4',
      id: 'community',
      icon: RImg3,
      desc: 'city-hall.PubReviewDesc',
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
      name: 'city-hall.PointsAndTokenAudit',
      link: '/city-hall/governance/audit',
      id: 'module-governance-audit',
      icon: RImg7,
      desc: 'city-hall.PointsAndTokenAuditDesc',
      Nolink: true,
    },
    {
      name: 'city-hall.ReviewProposal',
      link: '/city-hall/governance/review-proposal',
      id: 'module-governance-review-proposal',
      icon: RImg9,
      desc: 'city-hall.ReviewProposalDesc',
      Nolink: true,
    },
  ],
  governanceBtm: [
    {
      name: 'Governance.apply',
      link: '/city-hall/governance/issue',
      id: 'module-issue',
      icon: DistributeImg,
      desc: '',
    },
    {
      name: 'city-hall.GovernanceNodeResult',
      link: '/city-hall/governance/governance-node-result',
      id: 'module-governance-node-result',
      icon: NodeImg,
      desc: 'city-hall.GovernanceNodeResultDesc',
    },
    {
      name: 'city-hall.sns',
      link: '/sns-query',
      id: 'module-governance-node-result',
      icon: CreateImg,
      desc: 'city-hall.GovernanceNodeResultDesc',
    },
    {
      name: 'sbt.Apply',
      link: '/sbt/apply',
      id: 'module-governance-node-result',
      type:"icon",
      icon: baselineSquare,
      desc: 'sbt.Apply',
    },
    {
      name: 'sbt.Audit',
      link: '/sbt/list/pending',
      id: 'module-governance-node-result',
      type:"icon",
      icon: featherText,
      desc: 'sbt.Audit',
    },
    {
      name: 'sbt.Grant',
      link: '/sbt/list/approved',
      id: 'module-sbt',
      type:"icon",
      icon: lunchBox,
      desc: 'sbt.Grant',
    },
    {
      name: 'sbt.history',
      link: '/sbt/list/minted',
      id: 'module-governance-node-result',
      type:"icon",
      icon: textSquare,
      desc: 'sbt.history',
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
      name: 'city-hall.CommunityReview',
      link: 'https://tally.so/forms/mBp09R/submissions',
      id: 'community',
      icon: RImg9,
      desc: 'city-hall.CommunityReviewDesc',
    },
    {
      name: 'city-hall.AppReview',
      link: 'https://tally.so/forms/3XozzP/submissions',
      id: 'app',
      icon: RImg12,
      desc: 'city-hall.AppReviewDesc',
    },
    {
      name: 'sbt.create',
      link: '/sbt/create',
      id: 'module-sbt',
      icon: RImg6,
      desc: 'sbt.createDesc',
      Nolink: true,
    },
    // {
    //   name: 'city-hall.SeedReview',
    //   link: '',
    //   id: 'seed',
    //   icon: RImg5,
    //   desc: 'city-hall.SeedReviewDesc',
    // },
  ],
  apps: [
    {
      id: 'podcast',
      name: 'apps.podcastTitle',
      link: 'https://www.xiaoyuzhoufm.com/podcast/64a27b216d90c5786108abbc',
      icon: PodcastImg,
      desc: 'apps.podcastDesc',
    },
    {
      id: 'module-calendar',
      name: 'apps.OnlineEvent',
      link: '/online-event',
      icon: CalendarImg,
      desc: 'apps.OnlineEventDesc',
    },
    {
      id: 'module-sns',
      name: 'apps.SNS',
      link: '/sns/register',
      icon: SNSImg,
      desc: 'apps.SNSDesc',
    },
    {
      id: 'module-sns',
      name: 'apps.snsQuery',
      link: '/search-profile',
      icon: SNSQueryImg,
      desc: 'apps.SNSQueryDesc',
    },
    {
      id: 'module-assistant',
      name: 'apps.assistant',
      link: '/assistant',
      icon: AssistantImg,
      desc: 'apps.assistantDes',
    },
    {
      id: 'module-credit',
      name: 'apps.Credit',
      link: '/credit',
      icon: CreditImg,
      desc: 'apps.CreditDesc',
    },
    {
      id: 'module-wiki',
      name: 'apps.wiki',
      link: '/wiki',
      icon: WikiImg,
      desc: 'apps.WikiDesc',
    },
    {
      id: 'module-hub',
      name: 'apps.hub',
      link: '/hub',
      icon: HubImg,
      desc: 'apps.hubDesc',
    },
    {
      id: 'module-event',
      name: 'apps.Event',
      link: '/event',
      icon: EventImg,
      desc: 'apps.EventDesc',
    },
    {
      id: 'Deschool',
      name: 'DeSchool',
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
    // {
    //   id: 'module-pub',
    //   name: 'apps.Pub',
    //   link: '/hub',
    //   icon: '',
    //   desc: 'apps.PubDesc',
    // },
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
    {
      id: 'echo',
      app: 'apps.Echo',
      link: 'https://echo3.world/',
      icon: EchoImg,
      desc: 'apps.EchoDesc',
    },
    {
      id: ['preview', 'prod'].includes(process.env.REACT_APP_ENV_VERSION as string)
        ? 'coming-soon'
        : 'module-see',
      name: 'See Swap',
      link: '/see-swap',
      icon: 'https://avatars.githubusercontent.com/u/36115574?s=200&v=4',
      desc: 'Coming Soon',
    },


  ],
  publicity: [
    {
      id: 'pdf',
      name: 'SeeDAO白皮书',
      time: '2023-11-22 22:27',
      link: 'https://seedao.xyz/SeeDAO-WhitePaper.pdf',
    },

    {
      id: 'module-node',
      name: '当季SeeDAO治理节点名单',
      time: '2023-11-22 22:27',
      link: '/node',
    },
    // {
    //   id: '',
    //   name: 'S5 节点共识大会积分公示',
    //   time: '2023-11-22 22:27',
    //   link: 'https://seedao.notion.site/S5-6022ae9607f64019a10fd383db682706?pvs=4',
    // },
    {
      id: 'module-scr-rank',
      name: 'SeeDAO 积分总榜',
      time: '2023-11-13 20:00',
      link: '/ranking',
    },
    {
      id: 'module-archive',
      name: 'SeeDAO 档案馆',
      time: '2023-11-13 20:00',
      link: 'https://seedao.notion.site/SeeDAO-f57031667089473faa7ea3560d05960c',
    }
    // {
    //   id: '',
    //   name: 'SeeDAO两周年生态发布会！十二月中相约清迈',
    //   time: '2023-11-01 23:07',
    //   link: 'https://mp.weixin.qq.com/s/YVpeaHSRCfUj5EKlHdmsyA',
    // },
    // {
    //   id: '',
    //   name: 'SeeDAO APP 正式版 V 0.0.1 开始发布！（含测试奖励)',
    //   time: '2023-10-23 18:54',
    //   link: 'https://mp.weixin.qq.com/s/ahB4q1oF0C7KmfEb52vH8w',
    // },
    // {
    //   id: '',
    //   name: 'SeeDAO | Our Polis 发布会调整通知',
    //   time: '2023-10-23 18:54',
    //   link: 'https://mp.weixin.qq.com/s/s8ATHFdKhaMQ5SHkPjPAZQ',
    // },
  ],
};

export default links;
