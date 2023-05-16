import React from "react"
import {useState} from "@storybook/addons";
import Button from "./Button"
import type {Story, ComponentMeta} from '@storybook/react';
import type {ButtonProps} from "@acme/ui/src/nextjs/components/Buttons/Button";

const SectionComponent = Button
const SectionComponentName = 'Button'

const Meta: ComponentMeta<typeof SectionComponent> = {
	title: SectionComponentName,
	component: SectionComponent,
	parameters: {
		layout: 'fullscreen'
	}
}

export default Meta

export const Default = {
	args: {}
}
