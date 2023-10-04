import React from "react"
import { Card, Col, Row, theme, Typography } from "@acme/ui"
import type { Story } from "@storybook/react"
import type { ComponentMeta } from "@storybook/react";

const SectionComponent = Card
const SectionComponentName = "Card"

const Meta: ComponentMeta<typeof SectionComponent> = {
	title:      SectionComponentName,
	parameters: {
		layout: "fullscreen"
	}
}

export default Meta


const CardTemplate: Story<React.ComponentProps<typeof SectionComponent>> = (args) => {
	return (
		<Row className="h-full justify-center items-center">
			<SectionComponent className="m-4" {...args}>
				<Col>
					<Typography variant={"h3"}>
						Hello I&apos;m a card
					</Typography>
					<Typography color={theme.colorScheme.subtitle1} darkColor={theme.colorScheme.subtitle1}
					            variant={"body"}>
						And this is some test text for the card
					</Typography>
				</Col>
			</SectionComponent>
		</Row>
	)
}

export const Default = CardTemplate.bind ({})
Default.args = {
	...SectionComponent.defaultProps,
	height: '400px',
	width: '400px'
}
