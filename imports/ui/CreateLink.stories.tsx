import { expect } from "@storybook/jest";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { CreateLink } from "./CreateLink";

export default { component: CreateLink } satisfies Meta<typeof CreateLink>;

export const EmptyCreateLink: StoryObj<typeof CreateLink> = {};

export const FilledCreateLink: StoryObj<typeof CreateLink> = {
  play: ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByPlaceholderText("Title");
    const url = canvas.getByPlaceholderText("URL");
    const submit = canvas.getByRole("button", { name: "Submit" });
    userEvent.type(title, "Hello");
    userEvent.type(url, "https://www.meteor.com");
    userEvent.click(submit);
    expect(title).toHaveValue("Hello");
    expect(url).toHaveValue("https://www.meteor.com");
    expect(args.onCreated).toHaveBeenCalledWith({ title: "Hello", url: "https://www.meteor.com" });
    expect(args.onCreated).toHaveBeenCalledTimes(1);
  },
};
