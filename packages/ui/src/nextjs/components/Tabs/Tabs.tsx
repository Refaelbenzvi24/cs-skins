"use client";
import { useEffect, useState, useRef } from "react"

import { css } from "@emotion/css"
import { motion, type HTMLMotionProps } from "framer-motion"
import tw from "twin.macro"
import { useIsDark } from "../../index";
import theme from "../../Utils/theme";
import { withTheme } from "@emotion/react"

interface TabsProps {
	bgColor?: string
	bgColorDark?: string
	bgColorActiveTab?: string
	bgColorDarkActiveTab?: string
	dark?: boolean
}
// TODO: fix this component - split it into smaller components using emotion
const Tabs = (
	{
		bgColor = theme.colorScheme.light2,
		bgColorDark = theme.colorScheme.overlaysDark,
		bgColorActiveTab = theme.colorScheme.primary,
		bgColorDarkActiveTab = theme.colorScheme.primary,
		className,
		children,
		dark,
		...restProps
	}: TabsProps & HTMLMotionProps<"div">) => {
	const [tabsIndex, setTabsIndex] = useState<number | null> (1)
	const [activeTabWidth, setActiveTabWidth] = useState<number> ()
	const [activeTabHeight, setActiveTabHeight] = useState<number> ()
	const [activeTabXPos, setActiveTabXPos] = useState<number> ()
	const tabsRef = useRef<HTMLDivElement> (null)
	const dir = restProps.dir || "ltr"

	const globalIsDark = useIsDark ()

	const isDark = dark || globalIsDark

	useEffect (() => {
		if (tabsIndex && children && tabsRef.current) {
			const tabs = tabsRef.current.querySelectorAll ("a")

			tabs.forEach ((tab, index) => {
				tab.addEventListener ("click", () => {
					setTabsIndex (index + 1)
				})
			})
		}
	}, [children, tabsIndex])


	useEffect (() => {
		const controlActiveTab = () => {
			if (tabsIndex && children && tabsRef.current) {
				const tabs = tabsRef.current.querySelectorAll ("a")
				let distance = 0


				tabs.forEach ((tab, index) => {
					if (dir === "ltr" && index < tabsIndex - 1) distance += (tab.getBoundingClientRect ().width + 16)
					if (dir === "rtl" && index < tabsIndex - 1) distance -= (tab.getBoundingClientRect ().width + 16)
					tab.classList.remove ("tab-active")
				})

				tabs[tabsIndex - 1]?.classList.add ("tab-active")

				setActiveTabWidth (tabs[tabsIndex - 1]?.getBoundingClientRect ().width)
				setActiveTabHeight (tabs[tabsIndex - 1]?.getBoundingClientRect ().height)
				setActiveTabXPos (distance)
			}
		}

		controlActiveTab ()
	}, [dir, children, tabsIndex])

	return (
		<motion.div {...restProps} className={`${css`
          ${tw`rounded p-2`};

          background-color: ${bgColor};

          ${isDark && css`
            background-color: ${bgColorDark};
          `};
		`} ${className}`}>

			<span
				className={css`
                  ${tw`absolute bg-sky-800 transform transition-all ease-in-out duration-500 transform rounded`}
                  margin-top: -4px;
                  margin-left: -4px;
                  width: ${(activeTabWidth || 0) + 8}px;
                  height: ${(activeTabHeight || 0) + 8}px;
                  transform: ${`translate(${activeTabXPos}px)`};
                  z-index: 1;
                  background-color: ${bgColorActiveTab};

                  ${isDark && css`
                    background-color: ${bgColorDarkActiveTab};
                  `};
				`}/>

			<motion.div
				className={css`
                  ${tw`flex flex-row space-x-4 justify-center items-center`};
                  z-index: 2;
				`}
				ref={tabsRef}>
				{children}
			</motion.div>
		</motion.div>
	)
}

export default withTheme(Tabs)
