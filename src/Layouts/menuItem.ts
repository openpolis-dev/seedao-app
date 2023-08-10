import { MenuItemType } from '@paljs/ui/types';

export type CMenuItemType = MenuItemType & { value?: string };

const items: CMenuItemType[] = [
  {
    title: 'menus.Home',
    icon: { name: 'home-outline' },
    link: { href: '/home' },
  },
  {
    title: 'menus.Proposal',
    icon: { name: 'browser-outline' },
    link: { href: '/proposal' },
  },
  {
    title: 'menus.Project',
    icon: { name: 'layout-outline' },
    link: { href: '/project' },
  },
  {
    title: 'menus.Guild',
    icon: { name: 'people-outline' },
    link: { href: '/guild' },
  },
  {
    title: 'menus.Chat',
    icon: { name: 'browser-outline' },
    link: { href: '/chat' },
    value: 'chat',
  },
  {
    title: 'menus.city-hall',
    icon: { name: 'shield-outline' },
    link: { href: '/city-hall' },
    value: 'city-hall',
  },
  {
    title: 'menus.assets',
    icon: { name: 'cube-outline' },
    link: { href: '/assets' },
  },
];

export default items;
