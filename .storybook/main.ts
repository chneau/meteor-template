import type { ViteFinal } from "@storybook/builder-vite";
import type { StorybookConfig } from "@storybook/react-vite";

export default {
  stories: ["../imports/**/*.mdx", "../imports/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  features: {
    // interactionsDebugger: true,
  },
  core: {
    disableTelemetry: true,
  },
} satisfies StorybookConfig;

export const viteFinal: ViteFinal = (config) => ({ ...config, clearScreen: false });
