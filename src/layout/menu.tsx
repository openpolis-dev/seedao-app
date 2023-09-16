import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import MuiDrawer from '@mui/material/Drawer';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { House, Grid1x2, CashCoin, PieChart, People, Box2Heart, ShieldCheck, Envelope } from 'react-bootstrap-icons';
import React from 'react';
import useCheckLogin from 'hooks/useCheckLogin';
import { useAuthContext } from 'providers/authProvider';
import { WalletType } from 'wallet/wallet';

const Box = styled.div`
  background: #fff;
  width: 200px;
  box-sizing: border-box;
  padding: 20px;
  flex-shrink: 0;
`;

const LftLi = styled.div<{ selected?: boolean }>`
  padding: 13px 0;
  display: flex;
  align-items: center;
  border-bottom: 1px dashed #eee;
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
  ${(props) => props.selected && 'color: #a16eff;'}
`;
//
// const Drawer = styled(MuiDrawer)(({ theme, open }) => ({
//   '& .MuiDrawer-paper': {
//     position: 'relative',
//     whiteSpace: 'nowrap',
//     width: drawerWidth,
//     transition: theme.transitions.create('width', {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//     boxSizing: 'border-box',
//     ...(!open && {
//       overflowX: 'hidden',
//       transition: theme.transitions.create('width', {
//         easing: theme.transitions.easing.sharp,
//         duration: theme.transitions.duration.leavingScreen,
//       }),
//       width: theme.spacing(7),
//       [theme.breakpoints.up('sm')]: {
//         width: theme.spacing(9),
//       },
//     }),
//   },
// }));

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
}

const MenuItem = ({ data, onSelectMenu, selected }: IMenuItem) => {
  return (
    <LftLi onClick={() => onSelectMenu(data)} selected={selected}>
      <span className="icon">{data.icon.name}</span>
      <span className="name">{data.title}</span>
    </LftLi>
  );
};

export default function Menu({ open }: { open: boolean }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const isLogin = useCheckLogin();
  const {
    state: { wallet_type },
  } = useAuthContext();

  const onSelectMenu = (m: MenuItemType) => {
    navigate(m.link.href);
  };

  const menuItemsFormat = useMemo(() => {
    const display_items: MenuItemType[] = [];
    items.forEach((d) => {
      const _item = { ...d, title: t(d.title as any) };
      if (d.value === 'chat') {
        isLogin && wallet_type === WalletType.EOA && items.push(_item);
      } else {
        display_items.push(_item);
      }
    });
    return display_items;
  }, [t, isLogin, wallet_type]);
  return (
    // <div open={open}>
    <Box>
      {menuItemsFormat.map((item) => (
        <MenuItem
          key={item.title}
          data={item}
          onSelectMenu={onSelectMenu}
          selected={pathname.startsWith(item.link.href)}
        />
      ))}
    </Box>
  );
}
