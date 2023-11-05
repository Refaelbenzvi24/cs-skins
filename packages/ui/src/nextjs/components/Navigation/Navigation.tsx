"use client";
import type { ReactNode } from "react"

import clsx from "clsx"
import { type HTMLMotionProps } from "framer-motion"
import NavigationWrapper, { NavigationWrapperProps } from "./NavigationWrapper"
import { withTheme } from "@emotion/react"

interface NavigationProps extends Omit<HTMLMotionProps<"div">, "children">, NavigationWrapperProps {
	options: readonly {
		label: string,
		value: string
	}[] | {
		label: string,
		value: string
	}[]
	children: (item: {
		label: string,
		value: string,
		isSelected: boolean
	}, index: number) => ReactNode
	selected: {
		label: string,
		value: string
	}
}

const Navigation = (
	{
		vertical = false,
		selected,
		className,
		children,
		options,
		...restProps
	}: NavigationProps) => {

	return (
		<NavigationWrapper
			{...restProps}
			className={clsx (className)}>

			{options.map ((item, index) => (
				children ({ ...item, isSelected: (item.value === selected?.value) }, index)
			))}
		</NavigationWrapper>
	)
}

export default withTheme(Navigation)
