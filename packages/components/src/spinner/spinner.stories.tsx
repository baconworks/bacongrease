import type { Meta, StoryObj } from '@storybook/react';

import Spinner from './spinner.component';

const meta = {
  title: 'Primitives/Spinner',
  component: Spinner,
  parameters: { layout: 'centered' },
  decorators: [
    ( Story ) => (
      <div style={{ position: 'relative', width: 160, height: 160 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleColor: Story = {
  args: { colors: [ 'blue' ] },
};
