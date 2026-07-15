import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';

import SideDrop from './side-drop.component';
import Button from '../button/button.component';

const meta = {
  title: 'Primitives/SideDrop',
  component: SideDrop,
  parameters: { layout: 'centered' },
  // placeholder args satisfy the required props; stories drive state via render
  args: { open: false, onClose: () => {}, targetRef: { current: null } },
} satisfies Meta<typeof SideDrop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const targetRef = useRef<HTMLSpanElement>(null);
    const [ open, setOpen ] = useState(false);
    return (
      <div style={{ position: 'relative', padding: '6rem' }}>
        <span ref={ targetRef } style={{ display: 'inline-block' }}>
          <Button label="Toggle side-drop" onClick={ () => setOpen(( o ) => !o) } />
        </span>
        <SideDrop open={ open } targetRef={ targetRef } onClose={ () => setOpen(false) }>
          <ul style={{ display: 'grid', gap: '0.8rem' }}>
            <li>Edit</li>
            <li>Duplicate</li>
            <li>Delete</li>
          </ul>
        </SideDrop>
      </div>
    );
  },
};
