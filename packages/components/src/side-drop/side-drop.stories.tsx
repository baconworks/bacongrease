import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';

import SideDrop from './side-drop.component';
import Button from '../button/button.component';

const meta = {
  title: 'Primitives/SideDrop',
  component: SideDrop,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof SideDrop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const targetRef = useRef<HTMLButtonElement>(null);
    const [ open, setOpen ] = useState(false);
    return (
      <div style={{ position: 'relative', padding: '6rem' }}>
        <Button ref={ targetRef } label="Toggle side-drop" onClick={ () => setOpen(( o ) => !o) } />
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
