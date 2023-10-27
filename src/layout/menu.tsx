import { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import MenuSwitch from '../assets/Imgs/menuDark.png';
import HomeImg from '../assets/Imgs/darkMenu/home.png';
import HomeImgActive from '../assets/Imgs/darkMenu/home_active.png';
import HomeImgLight from '../assets/Imgs/lightMenu/home.png';
import HomeImgLightActive from '../assets/Imgs/lightMenu/home_active.png';

import EventImg from '../assets/Imgs/darkMenu/event.png';
import EventImgActive from '../assets/Imgs/darkMenu/event_active.png';
import EventImgLight from '../assets/Imgs/lightMenu/event.png';
import EventImgLightActive from '../assets/Imgs/lightMenu/event_active.png';

import CreditImg from '../assets/Imgs/darkMenu/credit.png';
import CreditImgActive from '../assets/Imgs/darkMenu/credit_active.png';
import CreditImgLight from '../assets/Imgs/lightMenu/credit.png';
import CreditImgLightActive from '../assets/Imgs/lightMenu/credit_active.png';

import ExploreImg from '../assets/Imgs/darkMenu/explore.png';
import ExploreImgActive from '../assets/Imgs/darkMenu/explore_active.png';
import ExploreImgLight from '../assets/Imgs/lightMenu/explore.png';
import ExploreImgLightActive from '../assets/Imgs/lightMenu/explore_active.png';

import CityHallImg from '../assets/Imgs/darkMenu/cityHall.png';
import CityHallImgActive from '../assets/Imgs/darkMenu/cityHall_active.png';
import CityHallImgLight from '../assets/Imgs/lightMenu/cityHall.png';
import CityHallImgLightActive from '../assets/Imgs/lightMenu/cityHall_active.png';

import GovernImg from '../assets/Imgs/darkMenu/govern.png';
import GovernImgActive from '../assets/Imgs/darkMenu/govern_active.png';
import GovernImgLight from '../assets/Imgs/lightMenu/govern.png';
import GovernImgLightActive from '../assets/Imgs/lightMenu/govern_active.png';

import React from 'react';
import useCheckLogin from 'hooks/useCheckLogin';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { WalletType } from 'wallet/wallet';
import AppVersion from '../components/version';

const Box = styled.div`
  background: var(--bs-background);
  border-right: 1px solid var(--bs-border-color);
  box-sizing: border-box;
  padding: 20px;
  width: 257px;
  flex-shrink: 0;
  position: relative;

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
    .liLine {
      justify-content: center;
    }
    .topLi {
      justify-content: center;
    }
  }
  @keyframes expand {
    0% {
      width: 94px;
    }
    25% {
      width: 150px;
    }
    50% {
      width: 200px;
    }
    100% {
      width: 257px;
    }
  }
  @keyframes unexpand {
    0% {
      width: 257px;
    }
    50% {
      width: 200px;
    }
    75% {
      width: 150px;
    }
    100% {
      width: 94px;
    }
  }
`;

const LftLi = styled.div<{ selected?: boolean }>`
  padding: 15px 0;
  display: flex;
  align-items: center;

  white-space: nowrap;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  .name {
    padding-left: 10px;
    padding-top: 3px;
    font-family: 'Poppins-Medium';
    ${(props) => props.selected && 'color: var(--bs-body-color_active);    font-family: Poppins-SemiBold;'}
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
    left: 60px;
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

const SwitchBox = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  img {
    cursor: pointer;
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
        active: HomeImgLightActive,
      },
    },
    link: { href: '/home' },
  },
  {
    title: 'Home.Apps',
    icon: {
      dark: {
        nor: HomeImg,
        active: HomeImgActive,
      },
      light: {
        nor: HomeImgLight,
        active: HomeImgLightActive,
      },
    },
    link: { href: '/apps' },
  },
  {
    title: 'menus.Event',
    icon: {
      dark: {
        nor: EventImg,
        active: EventImgActive,
      },
      light: {
        nor: EventImgLight,
        active: EventImgLightActive,
      },
    },
    link: { href: '/event' },
  },
  {
    title: 'Home.OnlineEvent',
    icon: {
      dark: {
        nor: HomeImg,
        active: HomeImgActive,
      },
      light: {
        nor: HomeImgLight,
        active: HomeImgLightActive,
      },
    },
    link: { href: '/online-event' },
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
        active: CreditImgLightActive,
      },
    },
    link: { href: '/assets' },
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
        active: ExploreImgLightActive,
      },
    },
    link: { href: '/explore' },
  },
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
  {
    title: 'menus.Proposal',
    icon: {
      dark: {
        nor: GovernImg,
        active: GovernImgActive,
      },
      light: {
        nor: GovernImgLight,
        active: GovernImgLightActive,
      },
    },
    link: { href: '/proposal' },
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
        active: CityHallImgLightActive,
      },
    },
    link: { href: '/city-hall' },
  },
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
  {
    title: 'menus.Resources',
    icon: {
      dark: {
        nor: HomeImg,
        active: HomeImgActive,
      },
      light: {
        nor: HomeImgLight,
        active: HomeImgLightActive,
      },
    },
    link: { href: '/resources' },
  },
];

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
      {/*<span className="icon">{data.icon.name}</span>*/}
      <img src={data.icon[theme ? 'dark' : 'light'][selected ? 'active' : 'nor']} alt="" />
      {open && <span className="name">{data.title}</span>}
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

  return (
    <Box className={boxClassName}>
      <div>
        <SwitchBox className="topLi" onClick={() => dispatch({ type: AppActionType.SET_EXPAND_MENU, payload: !open })}>
          <img src={theme ? MenuSwitch : MenuSwitch} alt="" />
        </SwitchBox>
      </div>
      {menuItemsFormat.map((item) => (
        <MenuItem
          open={open}
          key={item.title}
          data={item}
          theme={theme}
          onSelectMenu={onSelectMenu}
          selected={pathname.startsWith(item.link.href)}
        />
      ))}
      {!isMedium && <AppVersion open={open} />}
    </Box>
  );
}
