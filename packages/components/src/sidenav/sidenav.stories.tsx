import type { Meta, StoryObj } from '@storybook/react';
import { FaHome, FaFolder, FaUsers, FaCog } from 'react-icons/fa';

import Sidenav from './sidenav.component';
import Icon from '../icon/icon.component';
import Button from '../button/button.component';
import { ButtonVariants } from '../button/types/button.types';

const meta = {
  title: 'Primitives/Sidenav',
  component: Sidenav,
  parameters: { layout: 'fullscreen' },
  decorators: [
    ( Story ) => (
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', height: '100vh' }}>
        <Story />
        <main style={{ padding: '2rem' }}>Hover or toggle the nav on the left.</main>
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

export const Default: Story = {
  args: {
    linksData,
    pathname: '/projects',
  },
};

export const WithActionSlot: Story = {
  args: {
    linksData,
    pathname: '/',
    action: <Button label="New" variant={ ButtonVariants.tertiary } styleOptions={ [ 'pill' ] } />,
  },
};
