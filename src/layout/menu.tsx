import { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  House,
  Grid1x2,
  Calendar,
  CashCoin,
  PieChart,
  People,
  Box2Heart,
  ShieldCheck,
  Envelope,
  ChatDots,
  ViewList,
  Boxes,
} from 'react-bootstrap-icons';
import React from 'react';
import useCheckLogin from 'hooks/useCheckLogin';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { WalletType } from 'wallet/wallet';
import AppVersion from '../components/version';

const Box = styled.div`
  background: #fff;
  box-sizing: border-box;
  padding: 20px;
  width: 65px;
  flex-shrink: 0;
  &.expand.float {
    position: absolute;
    z-index: 100;
    top: 60px;
    left: 0;
    height: calc(100% - 60px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }
  &.expand {
    animation: 'expand' 0.1s ease;
    animation-fill-mode: forwards;
  }
  &.unexpand {
    animation: 'unexpand' 0.1s ease;
    animation-fill-mode: forwards;
  }
  @keyframes expand {
    0% {
      width: 65px;
    }
    25% {
      width: 70px;
    }
    50% {
      width: 80px;
    }
    100% {
      width: unset;
    }
  }
  @keyframes unexpand {
    0% {
      width: unset;
    }
    50% {
      width: 80px;
    }
    75% {
      width: 70px;
    }
    100% {
      width: 65px;
    }
  }
`;

const LftLi = styled.div<{ selected?: boolean }>`
  padding: 13px 0;
  display: flex;
  align-items: center;
  border-bottom: 1px dashed #eee;
  white-space: nowrap;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  .name {
    padding-left: 10px;
    padding-top: 3px;
  }
  .icon {
    font-size: 20px;
  }
  ${(props) => props.selected && 'color: var(--bs-primary);'}
  position: relative;
  .tooltip-content {
    position: absolute;
    padding: 5px 12px;
    border-radius: 8px;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    left: 40px;
    top: 15px;
    white-space: nowrap;
    background: #000;
    color: #fff;
    z-index: 99;
    font-size: 12px;
  }
  .tooltip-content::before {
    content: '';
    position: absolute;
    border: 6px solid transparent;
    border-bottom-color: #000;
    top: 8px;
    left: -16px;
    transform: translateX(50%) rotate(-90deg);
  }
`;

type MenuItemType = {
  title: string;
  icon: { name: React.ReactNode };
  link: { href: string };
  value?: string;
};

const items: MenuItemType[] = [
  {
    title: 'menus.Home',
    icon: { name: <House /> },
    link: { href: '/home' },
  },
  {
    title: 'Home.Apps',
    icon: { name: <Boxes /> },
    link: { href: '/apps' },
  },
  {
    title: 'menus.Event',
    icon: { name: <Grid1x2 /> },
    link: { href: '/event' },
  },
  {
    title: 'Home.OnlineEvent',
    icon: { name: <Calendar /> },
    link: { href: '/online-event' },
  },
  {
    title: 'menus.assets',
    icon: { name: <CashCoin /> },
    link: { href: '/assets' },
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
  // {
  //   title: 'menus.Proposal',
  //   icon: { name: <Box2Heart /> },
  //   link: { href: '/proposal' },
  // },
  {
    title: 'menus.city-hall',
    icon: { name: <ShieldCheck /> },
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
    icon: { name: <ViewList /> },
    link: { href: '/resources' },
  },
];

interface IMenuItem {
  data: MenuItemType;
  onSelectMenu: (m: MenuItemType) => void;
  selected?: boolean;
  open?: boolean;
}

const MenuItem = ({ data, onSelectMenu, selected, open }: IMenuItem) => {
  const [hover, setHover] = useState(false);
  return (
    <LftLi
      onClick={() => onSelectMenu(data)}
      selected={selected}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className="icon">{data.icon.name}</span>
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
    state: { wallet_type, account, expandMenu: open },
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
      {menuItemsFormat.map((item) => (
        <MenuItem
          open={open}
          key={item.title}
          data={item}
          onSelectMenu={onSelectMenu}
          selected={pathname.startsWith(item.link.href)}
        />
      ))}
      {!isMedium && <AppVersion open={open} />}
    </Box>
  );
}
