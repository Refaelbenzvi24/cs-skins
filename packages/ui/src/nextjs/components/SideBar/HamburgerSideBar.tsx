"use client";
import { useEffect, useRef } from "react"

import { css } from "@emotion/css"
import clsx from "clsx"
import { motion, AnimatePresence, useCycle, type HTMLMotionProps, type SVGMotionProps } from "framer-motion"
import tw from "twin.macro"

import { Button, useIsDark, theme, useMain } from "../../index"
import useDimensions from "../../hooks/useDimensions";
import { withTheme } from "@emotion/react"


const sidebar = {
	open:   ({ height = 200, width, isRTL }: {
		height: number,
		width: number,
		isRTL: boolean
	}) => ({
		paddingTop: 60,
		clipPath:   `circle(${height * 2 + 200}px at ${isRTL ? 40 : width - 40}px 40px)`,
		transition: {
			staggerChildren: 0.07,
			delayChildren:   0.2,
			type:            "spring",
			stiffness:       20,
			restDelta:       2,
		},
	}),
	closed: ({ width, isRTL }: {
		width: number,
		isRTL: boolean
	}) => ({
		paddingTop: 0,
		clipPath:   `circle(28px at ${isRTL ? 40 : width - 40}px 40px)`,
		transition: {
			staggerChildren:  0.05,
			staggerDirection: -1,
			delay:            0.5,
			type:             "spring",
			stiffness:        400,
			damping:          40,
		},
	}),
}

const Path = (props: SVGMotionProps<"path">) => {
	return (
		// @ts-expect-error - for some reason the types don't match up.
		<motion.path
			strokeWidth="2.5"
			stroke="currentColor"
			strokeLinecap="round"
			{...props}
		/>
	)
}

interface HamburgerSideBarProps extends HTMLMotionProps<"nav"> {
	width?: number
	isOpen?: boolean
	bgColor?: string
	bgColorDark?: string
	dark?: boolean
	dir?: "rtl" | "ltr"
	onIsOpenChange?: (isOpen: boolean) => void
}


const HamburgerSideBar = (
	{

		width = 350,
		bgColor = theme.colorScheme.light,
		bgColorDark = theme.colorScheme.dark,
		children,
		isOpen: isOpenProp,
		onIsOpenChange,
		className,
		dark,
		...restProps
	}: HamburgerSideBarProps) => {
	const {dir} = restProps

	const globalIsDarkMode = useIsDark ()
	const isDarkMode = dark || globalIsDarkMode
	const isRTL = dir === "rtl"

	const { isMobile } = useMain ()
	const { windowHeight, windowWidth } = useDimensions ()


	const [isOpen, toggleOpen] = useCycle (false, true)
	const containerRef = useRef (null)

	useEffect (() => {
		if (isOpenProp !== isOpen) toggleOpen ()
	}, [isOpenProp])


	useEffect (() => {
		if (onIsOpenChange) onIsOpenChange (isOpen)

		const root = document.querySelector ("#__next") as HTMLDivElement

		if (isOpen) {
			const html = document.querySelector ("html")
			document.body.style.overflowY = "hidden"
			root.style.overflowY = "hidden"
			if (html) html.style.overflowY = "hidden"
			if (!isMobile) root.style.paddingRight = "6px"
		}

		if (!isOpen) {
			setTimeout (() => {
				const html = document.querySelector ("html")
				document.body.style.overflowY = "auto"
				root.style.overflowY = "auto"
				if (html) html.style.overflowY = "auto"
				if (!isMobile) root.style.paddingRight = ""
			}, 900)
		}

		return () => {
			const html = document.querySelector ("html")
			document.body.style.overflowY = "auto"
			root.style.overflowY = "auto"
			if (html) html.style.overflowY = "auto"
			if (!isMobile) root.style.paddingRight = ""
		}
	}, [isOpen])


	return (
		<motion.nav
			initial={false}
			animate={isOpen ? "open" : "closed"}
			custom={windowHeight}
			ref={containerRef}>

			<AnimatePresence>
				{isOpen ? (
					// TODO: fix this - change to an external component
					<motion.div
						onClick={() => toggleOpen ()}
						className={css`
                          ${tw`fixed top-0 right-0 bottom-0 h-full w-full bg-white`};
                          z-index: ${theme.zIndex.appBar - 10};
                          background-color: ${isDarkMode ? theme.colorScheme.dark : theme.colorScheme.light}bb;
						`}
						initial={{
							opacity: 0,
						}}
						animate={{
							opacity:    1,
							transition: {
								type:      "spring",
								duration:  0.5,
								stiffness: 20,
								restDelta: 2,
							},
						}}
						exit={{
							opacity:    0,
							transition: {
								delay:     0.5,
								duration:  0.5,
								type:      "spring",
								stiffness: 400,
								damping:   40,
							},
						}}
					/>
				) : null}
			</AnimatePresence>

			{!!windowWidth && (
				<motion.div
					{...restProps}
					// TODO: fix this
					className={`${clsx (className)} ${css`
                      ${tw`fixed top-0 bottom-0 h-full`};
                      ${isRTL ? tw`left-0` : tw`right-0`};
                      background-color: ${isDarkMode ? bgColorDark : bgColor};
                      width: ${windowWidth > 500 ? windowWidth / 2 : windowWidth}px;
                      z-index: ${theme.zIndex.appBar};
					`}`}
					custom={{ width: windowWidth > 500 ? windowWidth / 2 : windowWidth, height: windowHeight, isRTL }}
					variants={sidebar}>
					{children}
				</motion.div>
			)}

			<motion.div className={css`
              ${tw`fixed rounded-full bottom-0 h-full`};
              ${isRTL ? tw`top-[14px] left-[14px]` : tw`top-[14px] right-[14px]`};
              background-color: transparent;
              box-shadow: ${isDarkMode ? theme.shadows["5"] : theme.shadows["3"]};
              width: 53px;
              height: 53px;
			`}/>

			<Button
				className={css`
                  ${tw`fixed top-0 p-2.5`};
                  ${isRTL ? tw`left-0 mt-[21px] ml-[18px]` : tw`right-0 mt-[20px] mr-[16px]`};
                  z-index: ${theme.zIndex.appBar + 1};
				`}
				id="theme-toggle-button"
				icon
				text
				size="28px"
				colorsForStates={theme.colorSchemeByState.secondary}
				colorsForStatesDark={theme.colorSchemeByState.secondary}
				onClick={() => toggleOpen ()}>
				<svg width="23" height="23" viewBox="0 0 23 23">
					<Path
						variants={{
							closed: { d: "M 2 2.5 L 20 2.5" },
							open:   { d: "M 3 16.5 L 17 2.5" },
						}}
					/>
					<Path
						d={isRTL ? "M 10 9.423 L 20 9.423" : "M 2 9.423 L 12 9.423"}
						variants={{
							closed: { opacity: 1 },
							open:   { opacity: 0 },
						}}
						transition={{ duration: 0.1 }}
					/>
					<Path
						variants={{
							closed: { d: "M 2 16.346 L 20 16.346" },
							open:   { d: "M 3 2.5 L 17 16.346" },
						}}
					/>
				</svg>
			</Button>
		</motion.nav>
	)
}

export default withTheme(HamburgerSideBar)
