import type { Meta, StoryObj } from '@storybook/react';
import { FaArrowRight } from 'react-icons/fa';

import Button from './button.component';
import { ButtonVariants } from './types/button.types';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: Object.values(ButtonVariants),
    },
    styleOptions: {
      control: 'check',
      options: [ 'circle', 'gradient', 'invert', 'outline', 'pill', 'reverse', 'shadow', 'text' ],
    },
  },
  args: {
    label: 'Button',
    variant: ButtonVariants.primary,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button label="Primary" variant={ ButtonVariants.primary } />
      <Button label="Secondary" variant={ ButtonVariants.secondary } />
      <Button label="Tertiary" variant={ ButtonVariants.tertiary } />
      <Button label="Greyscale" variant={ ButtonVariants.greyscale } />
    </div>
  ),
};

export const StyleOptions: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button label="Gradient" styleOptions={ [ 'gradient' ] } />
      <Button label="Outline" styleOptions={ [ 'outline' ] } />
      <Button label="Text" styleOptions={ [ 'text' ] } />
      <Button label="Pill" styleOptions={ [ 'pill' ] } />
      <Button label="Shadow" styleOptions={ [ 'shadow' ] } />
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    label: 'Continue',
    icon: FaArrowRight,
    styleOptions: [ 'gradient', 'reverse' ],
  },
};

export const Disabled: Story = {
  args: { label: 'Disabled', disabled: true },
};
