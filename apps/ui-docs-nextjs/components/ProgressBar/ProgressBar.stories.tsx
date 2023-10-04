import type {Meta, StoryObj} from "@storybook/react";
import {expect} from "@storybook/jest";
import {within} from "@storybook/testing-library";
import {ProgressBar, ProgressBarProps} from "./ProgressBar";

const meta = {
  title: "Feedback/ProgressBar",
  component: ProgressBar,
  argTypes: {
    value: {
      control: {type: "range"}
    }
  }
} satisfies Meta<ProgressBarProps>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Progress bar with 0% value */
export const Empty = {
  args: {
    value: 0
  },
  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    const progress = canvas.getByTestId("progress-bar-fill");

    expect(progress).toBeInTheDocument();
    expect(canvas.getByTestId("progress-bar-fill")).toHaveStyle(`--progress-bar-fill: ${args.value}%`);
  }
} satisfies Story;

/** Progress bar with 50% value */
export const Filled = {
  args: {
    value: 50
  },
  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    const progress = canvas.getByTestId("progress-bar-fill");

    expect(progress).toBeInTheDocument();
    expect(canvas.getByTestId("progress-bar-fill")).toHaveStyle(`--progress-bar-fill: ${args.value}%`);
  }
} satisfies Story;