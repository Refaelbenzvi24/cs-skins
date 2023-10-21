"use client";
import React from "react"
import { useEffect, useState } from "react"

import theme from "../../Utils/theme"
import { useMain } from "../../index";
import { type HTMLMotionProps } from "framer-motion"
import useScrollPosition from "../../hooks/useScrollPosition";
import AppBarWrapper from "./AppBarWrapper"
import { withTheme } from "@emotion/react"


export interface AppBarWrapperProps {
	dark?: boolean
	height?: number
	backgroundColor?: string
	darkBackgroundColor?: string
	hasBackground?: boolean
}


export interface AppBarProps extends Omit<AppBarWrapperProps, "hasBackground"> {
	hideOnScroll?: boolean
}


const AppBar = ({
	                backgroundColor = theme.colorScheme.accent,
	                darkBackgroundColor = theme.colorScheme.overlaysDark,
	                hideOnScroll = false,
	                height = 84,
	                children,
	                ...restProps
                }: AppBarProps & HTMLMotionProps<"div">) => {
	const { setAppBarState, setAppBarOpts, scrollDirection } = useMain ()
	const { scrollY } = useScrollPosition ()

	const [show, setShow] = useState (true)
	const [hasBackground, setHasBackground] = useState<boolean> (false)


	useEffect (() => {
		const controlAppbar = () => {
			if (hideOnScroll) {
				if (scrollDirection === "down" && scrollY && scrollY > 20) return setShow (false)
				if (scrollDirection === "up") return setShow (true)
			}
		}

		controlAppbar ()
	}, [hideOnScroll, scrollDirection, scrollY])


	useEffect (() => {
		setHasBackground (() => window.scrollY > 20)
	}, [])


	useEffect (() => {
		setAppBarState (() => true)

		return () => {
			setAppBarState (() => false)
		}
	}, [setAppBarState])

	useEffect (() => {
		if (window.scrollY > 20 && show) setHasBackground (true)

		if (window.scrollY <= 20 && show) setHasBackground (false)
	}, [show, scrollY])

	useEffect (() => {
		setAppBarOpts ((prev) => ({
			...prev,
			height,
		}))
	}, [height, setAppBarOpts])

	return (
		<AppBarWrapper
			hasBackground={hasBackground}
			animate={{
				translateY: show ? 0 : "-100%",
			}}
			transition={{
				duration: 0.3,
			}}
			backgroundColor={backgroundColor}
			darkBackgroundColor={darkBackgroundColor}
			height={height}
			{...restProps}
			id="app-bar">
			{children}
		</AppBarWrapper>
	)
}

export default withTheme(AppBar)
