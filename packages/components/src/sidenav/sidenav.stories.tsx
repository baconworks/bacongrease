import type { Meta, StoryObj } from '@storybook/react';
import { FaHome, FaFolder, FaUsers, FaCog, FaChartBar, FaTag } from 'react-icons/fa';

import Sidenav from './sidenav.component';
import Icon from '../icon/icon.component';

const meta = {
  title: 'Primitives/Sidenav',
  component: Sidenav,
  parameters: { layout: 'fullscreen' },
  decorators: [
    ( Story ) => (
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gridTemplateRows: '1fr', height: '100vh', overflow: 'hidden' }}>
        <Story />
        <main style={{ padding: '2rem' }}>Toggle the nav with the hamburger on the left.</main>
      </div>
    ),
  ],
} satisfies Meta<typeof Sidenav>;

export default meta;
type Story = StoryObj<typeof meta>;

const linksData = [
  { href: '/', text: 'home', title: 'Home', icon: <Icon icon={ FaHome } size={ 22 } /> },
  { href: '/projects', text: 'projects', title: 'Projects', icon: <Icon icon={ FaFolder } size={ 22 } /> },
  { href: '/clients', text: 'clients', title: 'Clients', icon: <Icon icon={ FaUsers } size={ 22 } /> },
  { href: '/settings', text: 'settings', title: 'Settings', icon: <Icon icon={ FaCog } size={ 22 } /> },
];

// Grouped sections — the host app decides membership (role/plan gating); the nav just renders.
const sections = [
  { links: [ { href: '/', text: 'home', title: 'Home', icon: <Icon icon={ FaHome } size={ 22 } /> } ] },
  {
    label: 'Work',
    links: [
      { href: '/projects', text: 'projects', title: 'Projects', icon: <Icon icon={ FaFolder } size={ 22 } /> },
      { href: '/clients', text: 'clients', title: 'Clients', icon: <Icon icon={ FaUsers } size={ 22 } /> },
    ],
  },
  {
    label: 'Insights',
    links: [
      { href: '/reports', text: 'reports', title: 'Reports', icon: <Icon icon={ FaChartBar } size={ 22 } /> },
      { href: '/tags', text: 'tags', title: 'Tags', icon: <Icon icon={ FaTag } size={ 22 } /> },
    ],
  },
];

export const Default: Story = {
  args: {
    linksData,
    pathname: '/projects',
  },
};

export const Grouped: Story = {
  args: {
    sections,
    pathname: '/projects',
  },
};

export const ChevronToggle: Story = {
  args: {
    sections,
    pathname: '/projects',
    toggle: 'chevron',
  },
};
