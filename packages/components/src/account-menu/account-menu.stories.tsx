import type { Meta, StoryObj } from '@storybook/react';

import AccountMenu from './account-menu.component';

const meta = {
  title: 'Primitives/AccountMenu',
  component: AccountMenu,
  parameters: { layout: 'centered' },
  decorators: [
    ( Story ) => (
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '32rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AccountMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// A fully-detailed identity — every optional field present.
export const Full: Story = {
  args: {
    user: {
      firstName: 'David',
      lastName: 'Bacon',
      email: 'david@example.com',
      username: 'dbacon',
      department: 'Sales',
      role: 'Agent',
    },
    onLogout: () => {},
  },
};

// Name only — the dropdown lays out just what it's given (initials still derive: "DB").
export const NameOnly: Story = {
  args: {
    user: { firstName: 'David', lastName: 'Bacon' },
    onLogout: () => {},
  },
};

// A single name — one initial ("D"), one-line identity.
export const FirstNameOnly: Story = {
  args: {
    user: { firstName: 'David', email: 'david@example.com' },
    onLogout: () => {},
  },
};

// An avatar image replaces the initials circle in both the trigger and the dropdown.
export const WithAvatarImage: Story = {
  args: {
    user: {
      firstName: 'David',
      lastName: 'Bacon',
      role: 'Agent',
      imageUrl: 'https://i.pravatar.cc/96?img=12',
    },
    onLogout: () => {},
  },
};
