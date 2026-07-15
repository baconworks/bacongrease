import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";

const here = dirname(fileURLToPath(import.meta.url));
const stylesSrc = resolve(here, "../packages/styles/src");

const config: StorybookConfig = {
  stories: [ "../packages/components/src/**/*.stories.@(ts|tsx)" ],
  addons: [ "@storybook/addon-essentials", "@storybook/addon-a11y" ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    config.css = config.css ?? {};
    config.css.preprocessorOptions = {
      ...( config.css.preprocessorOptions ?? {} ),
      scss: {
        // lets component stylesheets resolve the design system with
        // bare specifiers, e.g. `@use 'mixins' as globalMixins;`
        loadPaths: [ stylesSrc ],
      },
    };
    return config;
  },
};

export default config;
