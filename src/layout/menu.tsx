import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { House, Grid1x2, CashCoin, PieChart, People, Box2Heart, ShieldCheck, Envelope } from 'react-bootstrap-icons';
import React from 'react';
import useCheckLogin from 'hooks/useCheckLogin';
import { useAuthContext } from 'providers/authProvider';
import { WalletType } from 'wallet/wallet';

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
      width: 50px;
    }
    50% {
      width: 100px;
    }
    75% {
      width: 150px;
    }
    100% {
      width: 200px;
    }
  }
  @keyframes unexpand {
    0% {
      width: 200px;
    }
    25% {
      width: 150px;
    }
    50% {
      width: 100px;
    }
    75% {
      width: 50px;
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
    title: 'menus.Event',
    icon: { name: <Grid1x2 /> },
    link: { href: '/event' },
  },
  {
    title: 'menus.assets',
    icon: { name: <CashCoin /> },
    link: { href: '/assets' },
  },
  {
    title: 'menus.Project',
    icon: { name: <PieChart /> },
    link: { href: '/project' },
  },
  {
    title: 'menus.Guild',
    icon: { name: <People /> },
    link: { href: '/guild' },
  },
  {
    title: 'menus.Proposal',
    icon: { name: <Box2Heart /> },
    link: { href: '/proposal' },
  },
  {
    title: 'menus.city-hall',
    icon: { name: <ShieldCheck /> },
    link: { href: '/city-hall' },
  },

  {
    title: 'menus.Chat',
    icon: { name: <Envelope /> },
    link: { href: '/chat' },
    value: 'chat',
  },
];

interface IMenuItem {
  data: MenuItemType;
  onSelectMenu: (m: MenuItemType) => void;
  selected?: boolean;
  open?: boolean;
}

const MenuItem = ({ data, onSelectMenu, selected, open }: IMenuItem) => {
  return (
    <LftLi onClick={() => onSelectMenu(data)} selected={selected}>
      <span className="icon">{data.icon.name}</span>
      {open && <span className="name">{data.title}</span>}
    </LftLi>
  );
};

export default function Menu({ isMedium }: { isMedium: boolean }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const isLogin = useCheckLogin();
  const {
    state: { wallet_type, expandMenu: open },
  } = useAuthContext();

  const onSelectMenu = (m: MenuItemType) => {
    navigate(m.link.href);
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
    </Box>
  );
}
