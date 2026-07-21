import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import Modal from './modal.component';
import Button from '../button/button.component';

const meta = {
  title: 'Primitives/Modal',
  component: Modal,
  parameters: { layout: 'fullscreen' },
  // placeholder arg satisfies the required prop; the story drives state via render
  args: { open: false },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [ open, setOpen ] = useState(false);
    return (
      <div style={{ padding: '4rem' }}>
        <Button label="Open modal" onClick={ () => setOpen(true) } />
        <Modal open={ open } onClose={ () => setOpen(false) }>
          <div
            style={{
              background: 'white',
              padding: '3rem',
              borderRadius: '1rem',
              maxWidth: '32rem',
              display: 'grid',
              gap: '1.5rem',
              justifyItems: 'start',
            }}
          >
            <h2>Modal title</h2>
            <p>Click the backdrop or press Escape to close.</p>
            <Button label="Close" variant="secondary" onClick={ () => setOpen(false) } />
          </div>
        </Modal>
      </div>
    );
  },
};
