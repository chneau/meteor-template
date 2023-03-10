import { expect } from "@storybook/jest";
import type { Meta, StoryObj } from "@storybook/react";
import { within } from "@storybook/testing-library";
import { Info } from "./Info";

export default {
  component: Info,
  args: {
    links: [
      { _id: "1", title: "Do the Tutorial", url: "https://www.meteor.com/tutorials/react/creating-an-app" },
      { _id: "2", title: "Follow the Guide", url: "http://guide.meteor.com" },
      { _id: "3", title: "Read the Docs", url: "https://docs.meteor.com" },
      { _id: "4", title: "Discussions", url: "https://forums.meteor.com" },
    ],
  },
} satisfies Meta<typeof Info>;

export const EmptyInfo: StoryObj<typeof Info> = { args: { links: [] } };

export const FilledInfo: StoryObj<typeof Info> = {
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Do the Tutorial")).toBeInTheDocument();
    expect(canvas.getByText("Follow the Guide").getAttribute("href")).toBe("http://guide.meteor.com");
  },
};
