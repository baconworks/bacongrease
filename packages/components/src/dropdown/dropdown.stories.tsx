import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';

import Dropdown from './dropdown.component';
import Button from '../button/button.component';

const meta = {
  title: 'Primitives/Dropdown',
  component: Dropdown,
  parameters: { layout: 'centered' },
  // placeholder args satisfy the required props; stories drive state via render
  args: { open: false, onClose: () => {}, targetRef: { current: null } },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const targetRef = useRef<HTMLSpanElement>(null);
    const [ open, setOpen ] = useState(false);
    return (
      <div style={{ position: 'relative', padding: '6rem' }}>
        <span ref={ targetRef } style={{ display: 'inline-block' }}>
          <Button label="Toggle dropdown" onClick={ () => setOpen(( o ) => !o) } />
        </span>
        <Dropdown open={ open } targetRef={ targetRef } onClose={ () => setOpen(false) }>
          <ul style={{ display: 'grid', gap: '0.8rem' }}>
            <li>Profile</li>
            <li>Settings</li>
            <li>Sign out</li>
          </ul>
        </Dropdown>
      </div>
    );
  },
};
