import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import Hamburger from './hamburger.component';

const meta = {
  title: 'Primitives/Hamburger',
  component: Hamburger,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'grey' },
  },
} satisfies Meta<typeof Hamburger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Toggle: Story = {
  render: () => {
    const [ open, setOpen ] = useState(false);
    return <Hamburger open={ open } onClick={ () => setOpen(( o ) => !o) } />;
  },
};
