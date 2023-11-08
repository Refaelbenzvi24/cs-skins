"use client";
import { useEffect, useState, useRef } from "react"

import { css } from "@emotion/css"
import { motion, type HTMLMotionProps } from "framer-motion"
import tw from "twin.macro"
import { useIsDark } from "../../index";
import theme from "../../Utils/theme";
import { withTheme } from "@emotion/react"
import { SingleColorOptions } from "../Theme/types"
import TabsWrapper from "./TabsWrapper"
import ActiveTabIndicator from "./ActiveTabIndicator"
import TabsProvider from "./TabsProvider"
import { useTabs } from "./TabsContext"
import clsx from "clsx"
import StyledTabs from "./StyledTabs"


interface TabsProps {
	backgroundColor?: SingleColorOptions
	backgroundColorDark?: SingleColorOptions
	backgroundColorActiveTab?: SingleColorOptions
	backgroundColorDarkActiveTab?: SingleColorOptions
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
		...restProps
	}: TabsProps & HTMLMotionProps<"div">) => {
	const {tabs} = useTabs()

	const [tabsIndex, setTabsIndex]             = useState<number | null>(1)
	const [activeTabWidth, setActiveTabWidth]   = useState<number>()
	const [activeTabHeight, setActiveTabHeight] = useState<number>()
	const [activeTabXPos, setActiveTabXPos]     = useState<number>()
	const tabsRef                               = useRef<HTMLDivElement>(null)
	const dir                                   = restProps.dir || "ltr"

	const globalIsDark = useIsDark()

	const isDark = dark || globalIsDark

	useEffect(() => {
		if(tabsIndex && children && tabsRef.current){
			const tabs = tabsRef.current.querySelectorAll("a")

			tabs.forEach((tab, index) => {
				tab.addEventListener("click", () => {
					setTabsIndex(index + 1)
				})
			})
		}
	}, [children, tabsIndex])


	useEffect(() => {
		const controlActiveTab = () => {
			if(tabsIndex && children && tabsRef.current){
				const tabs   = tabsRef.current.querySelectorAll("a")
				let distance = 0


				tabs.forEach((tab, index) => {
					if(dir === "ltr" && index < tabsIndex - 1) distance += (tab.getBoundingClientRect().width + 16)
					if(dir === "rtl" && index < tabsIndex - 1) distance -= (tab.getBoundingClientRect().width + 16)
					tab.classList.remove("tab-active")
				})

				tabs[tabsIndex - 1]?.classList.add("tab-active")

				setActiveTabWidth(tabs[tabsIndex - 1]?.getBoundingClientRect().width)
				setActiveTabHeight(tabs[tabsIndex - 1]?.getBoundingClientRect().height)
				setActiveTabXPos(distance)
			}
		}

		controlActiveTab()
	}, [dir, children, tabsIndex])

	return (
		<StyledTabs {...restProps}
		            className={clsx(className)}>

			<ActiveTabIndicator
				xPosition={activeTabXPos}
				height={activeTabHeight}
				width={activeTabWidth}
				backgroundColor={backgroundColorActiveTab}
				backgroundColorDark={backgroundColorDarkActiveTab}/>

			<TabsWrapper
				ref={tabsRef}>
				{children}
			</TabsWrapper>
		</StyledTabs>
	)
}

const TabsWithProvider = (props: TabsProps & HTMLMotionProps<"div">) => {
	return (
		<TabsProvider>
			<Tabs {...props}/>
		</TabsProvider>
	)
}

export default withTheme(TabsWithProvider)
