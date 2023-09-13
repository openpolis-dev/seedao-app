import { useNavigate } from 'react-router-dom';
// import MuiDrawer from '@mui/material/Drawer';
// import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { ListGroup } from 'react-bootstrap';
import styled from 'styled-components';

const Box = styled.div`
  background: #fff;
  width: 240px;
  box-sizing: border-box;
  padding: 20px;
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
  icon: { name: string };
  link: { href: string };
  value?: string;
};

const items: MenuItemType[] = [
  {
    title: 'menus.Home',
    icon: { name: 'home-outline' },
    link: { href: '/home' },
  },
  {
    title: 'menus.Event',
    icon: { name: 'checkmark-square-2-outline' },
    link: { href: '/event' },
  },
  {
    title: 'menus.assets',
    icon: { name: 'cube-outline' },
    link: { href: '/assets' },
  },
  {
    title: 'menus.Project',
    icon: { name: 'pie-chart-outline' },
    link: { href: '/project' },
  },
  {
    title: 'menus.Guild',
    icon: { name: 'people-outline' },
    link: { href: '/guild' },
  },
  {
    title: 'menus.Proposal',
    icon: { name: 'browser-outline' },
    link: { href: '/proposal' },
  },
  {
    title: 'menus.city-hall',
    icon: { name: 'shield-outline' },
    link: { href: '/city-hall' },
  },

  {
    title: 'menus.Chat',
    icon: { name: 'message-circle-outline' },
    link: { href: '/chat' },
    value: 'chat',
  },
];

const MenuItem = ({ data, onSelectMenu }: { data: MenuItemType; onSelectMenu: (m: MenuItemType) => void }) => {
  const { t } = useTranslation();
  return (
    // <ListItemButton onClick={() => onSelectMenu(data)}>
    //   <ListItemIcon>{/* todo icon */}</ListItemIcon>
    //   <ListItemText primary={t(data.title as any)} />
    // </ListItemButton>

    <ListGroup onClick={() => onSelectMenu(data)}>
      <ListGroup.Item>{t(data.title as any)}</ListGroup.Item>
    </ListGroup>
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
