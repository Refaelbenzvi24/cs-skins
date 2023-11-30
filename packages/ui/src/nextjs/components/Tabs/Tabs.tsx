"use client";
import { useState, ReactNode, Children, isValidElement } from "react"
import { type HTMLMotionProps } from "framer-motion"
import { withTheme } from "@emotion/react"
import { SingleColorOptions } from "../Theme/types"
import clsx from "clsx"
import StyledTabs from "./StyledTabs"


interface TabsProps {
	children?: ReactNode
	backgroundColor?: SingleColorOptions
	backgroundColorDark?: SingleColorOptions
	backgroundColorActiveTab?: SingleColorOptions
	backgroundColorDarkActiveTab?: SingleColorOptions
	initialActiveTab?: string
	onChange?: (key: string) => void
	dark?: boolean
}


const Tabs = (
	{
		backgroundColor,
		backgroundColorDark,
		backgroundColorActiveTab,
		backgroundColorDarkActiveTab,
		className,
		children,
		dark,
		initialActiveTab,
		onChange,
		...restProps
	}: TabsProps & Omit<HTMLMotionProps<"div">, 'onChange'>) => {
	const [activeTab, setActiveTab] = useState<string> (initialActiveTab || "")
	const [activeTabIndex, setActiveTabIndex] = useState<number> (0)
	const [lastActiveTabIndex, setLastActiveTabIndex] = useState<number> (0)

	return (
		<StyledTabs {...restProps}
		            className={`flex flex-row justify-center items-center h-[50px] ${clsx (className)}`}>
			{Children.map (children, (child, index) => (isValidElement (child) ? {
				...child,
				props: {
					...child.props,
					onClick:  () => {
						if (child.props.onClick) child.props.onClick ()
						setLastActiveTabIndex (activeTabIndex)
						setActiveTab (child.key as string)
						setActiveTabIndex (index)
						if (onChange) onChange (child.key as string)
					},
					isActive: activeTab ? (child.key === activeTab) : (index === activeTabIndex),
					activeTabIndex,
					lastActiveTabIndex,
					index
				}
			} : child))}
		</StyledTabs>
	)
}

export default withTheme (Tabs)
