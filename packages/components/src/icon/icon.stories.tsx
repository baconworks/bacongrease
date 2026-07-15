import type { Meta, StoryObj } from '@storybook/react';
import { FaHeart, FaStar, FaBell } from 'react-icons/fa';

import Icon from './icon.component';

const meta = {
  title: 'Primitives/Icon',
  component: Icon,
  parameters: { layout: 'centered' },
  args: {
    icon: FaStar,
    size: 48,
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CurrentColor: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1.5rem', color: '#0693e3', fontSize: 0 }}>
      <Icon icon={ FaHeart } size={ 40 } />
      <Icon icon={ FaStar } size={ 40 } />
      <Icon icon={ FaBell } size={ 40 } />
    </div>
  ),
};

export const GradientFill: Story = {
  args: {
    icon: FaHeart,
    size: 64,
    gradientOptions: {
      id: 'icon-story-gradient',
      gradientStops: [
        { colorClass: 'stop-color-primary-300' },
        { colorClass: 'stop-color-primary-600' },
      ],
    },
  },
};
