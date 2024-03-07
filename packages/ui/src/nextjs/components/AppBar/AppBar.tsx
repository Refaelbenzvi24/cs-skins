"use client";
import React from "react"
import { useEffect, useState } from "react"

import theme from "../../utils/theme"
import { useMain } from "../../index";
import { type HTMLMotionProps } from "framer-motion"
import useScrollPosition from "../../hooks/useScrollPosition";
import AppBarWrapper, { AppBarWrapperProps } from "./AppBarWrapper"
import { withTheme } from "@emotion/react"


export interface AppBarProps extends Omit<AppBarWrapperProps, "hasBackground"> {
	hideOnScroll?: boolean
}

const AppBar = ({
	                backgroundColor,
	                backgroundColorDark,
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
			height={height}
			{...restProps}
			id="app-bar">
			{children}
		</AppBarWrapper>
	)
}

export default withTheme(AppBar)
