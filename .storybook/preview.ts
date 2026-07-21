import type { Preview } from "@storybook/react";

// Load the design system's base reset + utility layer once for every story so
// components render with the same typographic and color foundation as the app.
import "../packages/styles/src/index.scss";

const preview: Preview = {
  // A theme switch in the toolbar stamps [data-theme] on the root so stories can be viewed in
  // light or dark — exercising the design-token theming (ADR-0003).
  globalTypes: {
    theme: {
      description: "Theme",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    ( Story, { globals } ) => {
      document.documentElement.setAttribute( "data-theme", globals.theme || "light" );
      return Story();
    },
  ],
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
