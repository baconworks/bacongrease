import type { Meta, StoryObj } from '@storybook/react';
import { FaExternalLinkAlt } from 'react-icons/fa';

import Link from './link.component';
import Icon from '../icon/icon.component';

const meta = {
  title: 'Primitives/Link',
  component: Link,
  parameters: { layout: 'centered' },
  args: {
    href: '#',
    text: 'Bacongrease',
    title: 'Go to Bacongrease',
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = {
  args: { active: true },
};

export const WithIcon: Story = {
  args: {
    text: 'Docs',
    icon: <Icon icon={ FaExternalLinkAlt } size={ 16 } />,
    target: '_blank',
  },
};
