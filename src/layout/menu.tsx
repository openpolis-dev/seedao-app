import { useNavigate } from 'react-router-dom';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const drawerWidth: number = 240;

const Drawer = styled(MuiDrawer)(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

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
    <ListItemButton onClick={() => onSelectMenu(data)}>
      <ListItemIcon>{/* todo icon */}</ListItemIcon>
      <ListItemText primary={t(data.title as any)} />
    </ListItemButton>
  );
};

export default function Menu({ open }: { open: boolean }) {
  const navigate = useNavigate();

  const onSelectMenu = (m: MenuItemType) => {
    navigate(m.link.href);
  };
  return (
    <Drawer variant="permanent" open={open}>
      <List component="nav">
        {items.map((item) => (
          <MenuItem key={item.title} data={item} onSelectMenu={onSelectMenu} />
        ))}
      </List>
    </Drawer>
  );
}
