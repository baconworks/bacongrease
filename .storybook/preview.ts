import type { Preview } from "@storybook/react";

// Load the design system's base reset + utility layer once for every story so
// components render with the same typographic and color foundation as the app.
import "../packages/styles/src/index.scss";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "grey", value: "#abb8c3" },
        { name: "dark", value: "#231e1e" },
      ],
    },
  },
};

export default preview;
