import { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import MenuSwitch from '../assets/Imgs/darkMenu/menuSwitch.svg';
import MenuSwitchLight from '../assets/Imgs/lightMenu/menuSwitch.svg';

import HomeImg from '../assets/Imgs/darkMenu/home.svg';
import HomeImgActive from '../assets/Imgs/darkMenu/home_active.png';
import HomeImgLight from '../assets/Imgs/lightMenu/home.svg';

import AppImg from '../assets/Imgs/darkMenu/App.svg';
import AppImgActive from '../assets/Imgs/darkMenu/App_active.png';
import AppImgLight from '../assets/Imgs/lightMenu/App.svg';

import EventImg from '../assets/Imgs/darkMenu/event.svg';
import EventImgActive from '../assets/Imgs/darkMenu/event_active.png';
import EventImgLight from '../assets/Imgs/lightMenu/event.svg';

import CalendarImg from '../assets/Imgs/darkMenu/calendar.svg';
import CalendarActive from '../assets/Imgs/darkMenu/calendar_active.png';
import CalendarImgLight from '../assets/Imgs/lightMenu/calendar.svg';

import CreditImg from '../assets/Imgs/darkMenu/credit.svg';
import CreditImgActive from '../assets/Imgs/darkMenu/credit_active.png';
import CreditImgLight from '../assets/Imgs/lightMenu/credit.svg';

import ExploreImg from '../assets/Imgs/darkMenu/explore.svg';
import ExploreImgActive from '../assets/Imgs/darkMenu/explore_active.png';
import ExploreImgLight from '../assets/Imgs/lightMenu/explore.svg';

import CityHallImg from '../assets/Imgs/darkMenu/cityHall.svg';
import CityHallImgActive from '../assets/Imgs/darkMenu/cityHall_active.png';
import CityHallImgLight from '../assets/Imgs/lightMenu/cityHall.svg';

import ApplyImg from '../assets/Imgs/darkMenu/Applynow.svg';
import ApplyImgActive from '../assets/Imgs/darkMenu/Applynow_active.png';
import ApplyImgLight from '../assets/Imgs/lightMenu/Applynow.svg';

import GovernImg from '../assets/Imgs/darkMenu/govern.svg';
import GovernImgActive from '../assets/Imgs/darkMenu/govern_active.png';
import GovernImgLight from '../assets/Imgs/lightMenu/govern.svg';

import PubImg from '../assets/Imgs/darkMenu/pub.svg';
import PubImgActive from '../assets/Imgs/darkMenu/pub_active.png';
import PubImgLight from '../assets/Imgs/lightMenu/pub.svg';

import WikiImg from '../assets/Imgs/lightMenu/wiki.png';
import WikiWhite from '../assets/Imgs/darkMenu/wikiWhite.png';
import WikiImgActive from '../assets/Imgs/darkMenu/wiki_active.png';

import FreshImg from '../assets/Imgs/darkMenu/fresh.png';
import FreshWhite from '../assets/Imgs/darkMenu/freshWhite.png';
import FreshActive from '../assets/Imgs/darkMenu/fresh_active.png';

import React from 'react';
import useCheckLogin from 'hooks/useCheckLogin';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { WalletType } from 'wallet/wallet';
import AppVersion from '../components/version';

const LftLi = styled.div<{ selected?: boolean }>`
  padding: 10px 0;
  display: flex;
  align-items: center;

  white-space: nowrap;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  .hover {
    position: relative;
    .lftDecor {
      display: block;
      background: var(--bs-primary);
      z-index: 9;
      position: absolute;
      border-bottom-right-radius: 40px;
      border-top-right-radius: 40px;
      width: 4px;
      height: 24px;
      left: -20px;
      top: 0;
    }
  }
  .none {
    .lftDecor {
      display: none;
    }
  }
  .name {
    padding-left: 10px;
    padding-top: 3px;
    font-family: 'Poppins-Regular';
    color: var(--menu-color);
    ${(props) => props.selected && '   font-family: Poppins-SemiBold;'}
  }
  img {
    width: 24px;
  }
  //.icon {
  //  font-size: 20px;
  //}

  position: relative;
  .tooltip-content {
    position: absolute;
    padding: 5px 12px;
    border-radius: 8px;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    left: 45px;
    top: 15px;
    white-space: nowrap;
    background: var(--bs-menu-hover);
    color: var(--bs-body-color_active);
    z-index: 99;
    font-size: 12px;
  }
  .tooltip-content::before {
    content: '';
    position: absolute;
    border: 6px solid transparent;
    border-bottom-color: var(--bs-menu-hover);
    top: 8px;
    left: -16px;
    transform: translateX(50%) rotate(-90deg);
  }
`;

const Box = styled.div`
  background: var(--bs-background);
  border-right: 1px solid var(--bs-border-color);
  box-sizing: border-box;
  padding: 20px 20px 15px;
  flex-shrink: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &.expand.float {
    position: absolute;
    z-index: 100;
    top: 60px;
    left: 0;
    height: calc(100% - 60px);
  }
  &.expand {
    animation: 'expand' 0.1s ease;
    animation-fill-mode: forwards;
  }
  &.unexpand {
    animation: 'unexpand' 0.1s ease;
    animation-fill-mode: forwards;
    padding-inline: 10px;
    .liLine {
      justify-content: center;
    }
    .topLi {
      justify-content: center;
    }
    .lftDecor {
      left: -22px;
    }
  }
  @keyframes expand {
    0% {
      width: 94px;
    }
    25% {
      width: 110px;
    }
    50% {
      width: 130px;
    }
    100% {
      width: unset;
    }
  }
  @keyframes unexpand {
    0% {
      width: 100px;
    }
    25% {
      width: 90px;
    }
    75% {
      width: 70px;
    }
    100% {
      width: unset;
    }
  }
`;

const SwitchBox = styled.div<{ open: string }>`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  img {
    cursor: pointer;
    transform: ${(props) => (props.open === 'open' ? 'rotateY(180deg)' : 'rotateY(0deg)')};
  }
`;

type MenuItemType = {
  title: string;
  icon: any;
  link: { href: string };
  value?: string;
};

const items: MenuItemType[] = [
  {
    title: 'menus.Home',
    icon: {
      dark: {
        nor: HomeImg,
        active: HomeImgActive,
      },
      light: {
        nor: HomeImgLight,
        active: HomeImgActive,
      },
    },
    link: { href: '/home' },
  },
  {
    title: 'menus.assets',
    icon: {
      dark: {
        nor: CreditImg,
        active: CreditImgActive,
      },
      light: {
        nor: CreditImgLight,
        active: CreditImgActive,
      },
    },
    link: { href: '/assets' },
  },
  {
    title: 'menus.Proposal',
    icon: {
      dark: {
        nor: GovernImg,
        active: GovernImgActive,
      },
      light: {
        nor: GovernImgLight,
        active: GovernImgActive,
      },
    },
    link: { href: '/proposal' },
  },
  {
    title: 'menus.Resources',
    icon: {
      dark: {
        nor: ApplyImg,
        active: ApplyImgActive,
      },
      light: {
        nor: ApplyImgLight,
        active: ApplyImgActive,
      },
    },
    link: { href: '/resources' },
  },
  {
    title: 'menus.city-hall',
    icon: {
      dark: {
        nor: CityHallImg,
        active: CityHallImgActive,
      },
      light: {
        nor: CityHallImgLight,
        active: CityHallImgActive,
      },
    },
    link: { href: '/city-hall' },
  },
  {
    title: 'menus.Explore',
    icon: {
      dark: {
        nor: ExploreImg,
        active: ExploreImgActive,
      },
      light: {
        nor: ExploreImgLight,
        active: ExploreImgActive,
      },
    },
    link: { href: '/explore' },
  },
  {
    title: 'Home.Apps',
    icon: {
      dark: {
        nor: AppImg,
        active: AppImgActive,
      },
      light: {
        nor: AppImgLight,
        active: AppImgActive,
      },
    },
    link: { href: '/apps' },
  },
  // {
  //   title: 'menus.Event',
  //   icon: {
  //     dark: {
  //       nor: EventImg,
  //       active: EventImgActive,
  //     },
  //     light: {
  //       nor: EventImgLight,
  //       active: EventImgActive,
  //     },
  //   },
  //   link: { href: '/event' },
  // },
  // {
  //   title: 'Home.OnlineEvent',
  //   icon: {
  //     dark: {
  //       nor: CalendarImg,
  //       active: CalendarActive,
  //     },
  //     light: {
  //       nor: CalendarImgLight,
  //       active: CalendarActive,
  //     },
  //   },
  //   link: { href: '/online-event' },
  // },
  // {
  //   title: 'menus.Pub',
  //   icon: {
  //     dark: {
  //       nor: PubImg,
  //       active: PubImgActive,
  //     },
  //     light: {
  //       nor: PubImgLight,
  //       active: PubImgActive,
  //     },
  //   },
  //   link: { href: '/hub' },
  // },

  // {
  //   title: 'menus.Project',
  //   icon: { name: <PieChart /> },
  //   link: { href: '/project' },
  // },
  // {
  //   title: 'menus.Guild',
  //   icon: { name: <People /> },
  //   link: { href: '/guild' },
  // },

  // {
  //   title: 'menus.Chat',
  //   icon: { name: <ChatDots /> },
  //   link: { href: '/chat' },
  //   value: 'chat',
  // },

  // {
  //   title: 'menus.feedback',
  //   icon: { name: <Envelope /> },
  //   link: { href: '/feedback' },
  //   value: 'feedback',
  // },
];
// if (['dev', undefined].includes(process.env.REACT_APP_ENV_VERSION)) {
//   items.push({
//     title: 'menus.Newcomer',
//     icon: {
//       dark: {
//         nor: FreshWhite,
//         active: FreshActive,
//       },
//       light: {
//         nor: FreshImg,
//         active: FreshActive,
//       },
//     },
//     link: { href: '/newcomer' },
//   });
// }
// items.push({
//   title: 'Wiki',
//   icon: {
//     dark: {
//       nor: WikiWhite,
//       active: WikiImgActive,
//     },
//     light: {
//       nor: WikiImg,
//       active: WikiImgActive,
//     },
//   },
//   link: { href: '/wiki' },
// });

interface IMenuItem {
  data: MenuItemType;
  onSelectMenu: (m: MenuItemType) => void;
  selected?: boolean;
  open?: boolean;
  theme: boolean;
}

const MenuItem = ({ data, onSelectMenu, selected, open, theme }: IMenuItem) => {
  const [hover, setHover] = useState(false);
  return (
    <LftLi
      onClick={() => onSelectMenu(data)}
      selected={selected}
      className="liLine"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={selected ? 'hover' : 'none'}>
        <div className="lftDecor" />
        {/*<span className="icon">{data.icon.name}</span>*/}
        <img src={data.icon[theme ? 'dark' : 'light'][selected ? 'active' : 'nor']} alt="" />
        {open && <span className="name">{data.title}</span>}
      </div>
      {!open && hover && <span className="tooltip-content">{data.title}</span>}
    </LftLi>
  );
};

export default function Menu({ isMedium }: { isMedium: boolean }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const {
    state: { wallet_type, account, expandMenu: open, theme },
    dispatch,
  } = useAuthContext();

  const isLogin = useCheckLogin(account);

  const onSelectMenu = (m: MenuItemType) => {
    navigate(m.link.href);
    if (isMedium && open) {
      dispatch({ type: AppActionType.SET_EXPAND_MENU, payload: false });
    }
  };

  const menuItemsFormat = useMemo(() => {
    const display_items: MenuItemType[] = [];
    items.forEach((d, i) => {
      const _item = { ...d, title: t(d.title as any) };
      if (d.value === 'chat') {
        isLogin && wallet_type === WalletType.EOA && display_items.push(_item);
      } else {
        display_items.push(_item);
      }
    });
    return display_items;
  }, [t, isLogin, wallet_type]);

  const boxClassName = useMemo(() => {
    return (isMedium ? 'float ' : '') + (open ? 'expand' : 'unexpand');
  }, [isMedium, open]);

  const returnSelected = (url: string) => {
    const projectGuild = url.startsWith('/explore') && (pathname.includes('/project') || pathname.includes('/guild'));
    const assets = pathname.includes('/ranking') && url.startsWith('/assets');
    const apps = pathname.startsWith('/sns') && url.startsWith('/apps');
    return pathname.startsWith(url) || projectGuild || assets || apps;
  };
  return (
    <Box className={boxClassName}>
      <div>
        <SwitchBox
          open={open ? 'open' : ''}
          className="topLi"
          onClick={() => dispatch({ type: AppActionType.SET_EXPAND_MENU, payload: !open })}
        >
          <img src={theme ? MenuSwitch : MenuSwitchLight} alt="" />
        </SwitchBox>
        {menuItemsFormat.map((item) => (
          <MenuItem
            open={open}
            key={item.title}
            data={item}
            theme={theme}
            onSelectMenu={onSelectMenu}
            selected={returnSelected(item.link.href)}
          />
        ))}
      </div>
      {!isMedium && <AppVersion open={open} />}
    </Box>
  );
}
