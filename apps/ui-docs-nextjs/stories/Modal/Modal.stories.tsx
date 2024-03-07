import React from "react"
import { Button, Main, Modal, Typography } from "@acme/ui"
import type { Story, ComponentMeta } from "@storybook/react"
import { useState } from "react"


const SectionComponent     = Modal
const SectionComponentName = "Modal"

const Meta: ComponentMeta<typeof SectionComponent> = {
	title:      SectionComponentName,
	parameters: {
		layout: "fullscreen"
	}
}

export default Meta


const SectionTemplate: Story<React.ComponentProps<typeof SectionComponent>> = (args) => {
	const [isOpen, setIsOpen] = useState<boolean>(false)

	return (
		<>
			<SectionComponent
				{...args}
				isOpen={isOpen}
				centered
				onBackdropClick={() => setIsOpen(false)}>
				<div className="flex justify-center items-center h-full w-full">
					<Typography variant={"body"} centered>
						{`Hello There I'm a modal! :)`}
					</Typography>
				</div>
			</SectionComponent>

			<Main className="flex justify-center py-10">
				<div className="space-x-2">
					<Button
						onClick={() => setIsOpen(!isOpen)}>
						<Typography variant={"button"}>
							Modal Toggle
						</Typography>
					</Button>
				</div>
			</Main>
		</>
	)
}

export const Default = SectionTemplate.bind({})
Default.args         = {
	...SectionComponent.defaultProps,
}
