import React from 'react'
import {CubicProgress, ImpulseSpinner, Main, Skeleton} from "@acme/ui"
import type {Story, ComponentMeta} from '@storybook/react'

const SectionComponent1 = CubicProgress
const SectionComponent2 = ImpulseSpinner
const SectionComponent3 = Skeleton

const SectionComponentName = 'Loader'


const Meta: ComponentMeta<React.FC> = {
	title: SectionComponentName,
	parameters: {
		layout: 'fullscreen'
	}
}

export default Meta


const SectionTemplate1: Story<React.ComponentProps<typeof SectionComponent1>> = () => {
	return (
		<Main className="flex justify-center py-10">
			<div>
				<SectionComponent1/>
			</div>
		</Main>
	)
}

export const Cubic = SectionTemplate1.bind({})
Cubic.args = {}

const SectionTemplate2: Story<React.ComponentProps<typeof SectionComponent2>> = () => {
	return (
		<Main className="flex justify-center py-10">
			<div>
				<SectionComponent2 size={75}
				                   backColor="#626262"
				                   frontColor="#536473"/>
			</div>
		</Main>
	)
}

export const Impulse = SectionTemplate2.bind({})
Impulse.args = {}


const SectionTemplate3: Story<React.ComponentProps<typeof SectionComponent3>> = () => {
	return (
		<Main className="flex justify-center py-10">
			<div className="flex flex-col w-full px-4">
				<SectionComponent3 height={'30px'} width={'65%'}/>
				
				<div className="w-full pt-4 space-y-3">
					<SectionComponent3 height={'14px'} width={'40%'}/>
					<SectionComponent3 height={'14px'} width={'40%'}/>
					<SectionComponent3 height={'14px'} width={'40%'}/>
					<SectionComponent3 height={'14px'} width={'40%'}/>
					<SectionComponent3 height={'14px'} width={'40%'}/>
				</div>
			</div>
		</Main>
	)
}

export const SkeletonLoader = SectionTemplate3.bind({
	...SectionComponent3.defaultProps
})
SkeletonLoader.args = {}
