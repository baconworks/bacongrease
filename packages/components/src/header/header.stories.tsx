import type { Meta, StoryObj } from '@storybook/react';
import { FaBell, FaRegQuestionCircle } from 'react-icons/fa';

import Header from './header.component';
import AccountMenu from '../account-menu/account-menu.component';
import Icon from '../icon/icon.component';

const meta = {
  title: 'Primitives/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

const brand = <span>Sales Platform</span>;

const account = (
  <AccountMenu
    user={ { firstName: 'David', lastName: 'Bacon', email: 'david@example.com', role: 'Agent' } }
    onLogout={ () => {} }
  />
);

const search = (
  <input type="search" placeholder="Search…" style={{ width: '100%', padding: '0.6rem 1rem' }} />
);

const tools = (
  <>
    <button type="button" title="Help" aria-label="Help"><Icon icon={ FaRegQuestionCircle } size={ 18 } /></button>
    <button type="button" title="Notifications" aria-label="Notifications"><Icon icon={ FaBell } size={ 18 } /></button>
  </>
);

// The full bar — branding, search, a tools cluster, and the account widget.
export const Full: Story = {
  args: { branding: brand, search, tools, account },
};

// Search off (slot omitted), no tools — the minimal chrome.
export const Minimal: Story = {
  args: { branding: brand, account },
};

// Branding + search, no account (a signed-out bar).
export const SignedOut: Story = {
  args: { branding: brand, search },
};
