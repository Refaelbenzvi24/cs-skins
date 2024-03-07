import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarProps } from "./Avatar";
import { AVATAR_SIZE } from "./Avatar.utils";
import AvatarJpg from "public/avatar.jpg";
import styles from "@/styles/Storybook.module.scss";


const meta = {
	title:      "Display/Avatar",
	component:  Avatar,
	decorators: [
		(Story) => (
			<div className={styles.storybookMultipleStoryWrapper}>
				<Story/>
			</div>
		)
	]
} satisfies Meta<AvatarProps>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Default Avatar variant */
export const Default = {
	args: {
		src:  AvatarJpg,
		size: AVATAR_SIZE.MD
	}
} satisfies Story;

/** Avatar component with different sizes */
export const AllSizes = {
	args:   {
		src: AvatarJpg
	},
	render: (args) => <>
		<Avatar {...args} size={AVATAR_SIZE.SM}/>
		<Avatar {...args} size={AVATAR_SIZE.MD}/>
		<Avatar {...args} size={AVATAR_SIZE.LG}/>
		<Avatar {...args} size={AVATAR_SIZE.XL}/>
	</>
} satisfies Story;
