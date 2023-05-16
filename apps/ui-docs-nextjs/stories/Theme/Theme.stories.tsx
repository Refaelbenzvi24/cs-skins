import React from 'react'
import {Card, Main, theme, Typography} from "@acme/ui"
import type {Story, ComponentMeta} from '@storybook/react'

const SectionComponentName = 'Theme'

const Meta: ComponentMeta<React.FC> = {
	title: SectionComponentName,
	parameters: {
		layout: 'fullscreen'
	}
}

export default Meta


const SectionTemplate: Story = () => {
	return (
		<Main className="flex justify-center pt-10 px-10">
			<div className="flex flex-col w-full h-fit items-center space-y-4">
				{Object.keys(theme.colorScheme).map((color, index) => (
					<Card
						className="flex justify-center items-center"
						key={color}
						width={'60%'}
						height={100}
						bgColor={Object.values(theme.colorScheme)[index]}
						bgColorDark={Object.values(theme.colorScheme)[index]}>
						<Typography
							darkColor={'black'}
							variant={'h3'}>
							{color}
						</Typography>
					</Card>
				))}
			</div>
		</Main>
	)
}

export const Default = SectionTemplate.bind({})
Default.args = {}
