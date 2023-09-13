import { useNavigate } from 'react-router-dom';
// import MuiDrawer from '@mui/material/Drawer';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { House, Grid1x2, CashCoin, PieChart, People, Box2Heart, ShieldCheck, Envelope } from 'react-bootstrap-icons';
import React from 'react';

const Box = styled.div`
  background: #fff;
  width: 200px;
  box-sizing: border-box;
  padding: 20px;
  flex-shrink: 0;
`;

const LftLi = styled.div`
  padding: 20px 0;
  display: flex;
  align-items: center;
  border-bottom: 1px dashed #eee;
  cursor: pointer;
  .name {
    padding-left: 10px;
    padding-top: 3px;
  }
  .icon {
    font-size: 20px;
  }
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

const MenuItem = ({ data, onSelectMenu }: { data: MenuItemType; onSelectMenu: (m: MenuItemType) => void }) => {
  const { t } = useTranslation();
  return (
    <LftLi onClick={() => onSelectMenu(data)}>
      <span className="icon">{data.icon.name}</span>
      <span className="name">{t(data.title as any)}</span>
    </LftLi>
  );
};

export default function Menu({ open }: { open: boolean }) {
  const navigate = useNavigate();

  const onSelectMenu = (m: MenuItemType) => {
    navigate(m.link.href);
  };
  return (
    // <div open={open}>
    <Box>
      {items.map((item) => (
        <MenuItem key={item.title} data={item} onSelectMenu={onSelectMenu} />
      ))}
    </Box>
  );
}
