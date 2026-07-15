import type { Meta, StoryObj } from '@storybook/react';

import LinearGradient from './linear-gradient.component';

const meta = {
  title: 'Primitives/LinearGradient',
  component: LinearGradient,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof LinearGradient>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * LinearGradient renders an SVG `<linearGradient>` — it must live inside a
 * `<defs>` and be referenced by a paint (`fill="url(#id)"`). This story wires
 * that up around a rounded rect.
 */
export const PrimaryFamily: Story = {
  render: () => (
    <svg width={ 240 } height={ 120 }>
      <defs>
        <LinearGradient
          id="lg-primary"
          gradientStops={ [
            { colorClass: 'stop-color-primary-200' },
            { colorClass: 'stop-color-primary-400' },
            { colorClass: 'stop-color-primary-600' },
          ] }
        />
      </defs>
      <rect width={ 240 } height={ 120 } rx={ 12 } fill="url(#lg-primary)" />
    </svg>
  ),
};

export const TertiaryDiagonal: Story = {
  render: () => (
    <svg width={ 240 } height={ 120 }>
      <defs>
        <LinearGradient
          id="lg-tertiary"
          gradientAngle={ 45 }
          gradientStops={ [
            { colorClass: 'stop-color-tertiary-100' },
            { colorClass: 'stop-color-tertiary-500' },
          ] }
        />
      </defs>
      <rect width={ 240 } height={ 120 } rx={ 12 } fill="url(#lg-tertiary)" />
    </svg>
  ),
};
