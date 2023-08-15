import { MenuItemType } from '@paljs/ui/types';

export type CMenuItemType = MenuItemType & { value?: string };

const items: CMenuItemType[] = [
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

export default items;
