"use client";
import { useEffect } from "react"

import { css } from "@emotion/css"
import styled from "@emotion/styled"
import clsx from "clsx"
import { motion, type HTMLMotionProps } from "framer-motion"

import Backdrop, { type BackdropProps } from "../Backdrop/Backdrop"
import theme from "../../utils/theme"
import { marginTransition } from "../../utils/transitions"
import useDimensions from "../../hooks/useDimensions"
import { useMain } from "../../index"
import tw from "twin.macro"
import { CssUnit } from "../../utils/utils";
import { withTheme } from "@emotion/react"


const MainDiv = styled(motion.div)(() => [])

interface MainProps {
	dark?: boolean
	backdropProps?: BackdropProps & HTMLMotionProps<"div">
}


const Main = (props: MainProps & HTMLMotionProps<"div">) => {
	const { sideBarState: sideBar, sideBarOpts, overlayState, setSideBarState, setOverlayState } = useMain()

	const { windowWidth } = useDimensions()

	const { children, className, dark, backdropProps, ...restProps } = props
	const { shrinkPoint }                                            = sideBarOpts

	const initializeOverlayState = () => {
		const overlaysRoot = document.querySelector("#portals-root")
		if(overlaysRoot?.childNodes && overlaysRoot.childNodes.length > 0) return setOverlayState(true)

		setOverlayState(false)
	}

	useEffect(() => {
		initializeOverlayState()
	}, [])

	const overlayAction      = () => {
		if(sideBar){
			setSideBarState(false)
			setOverlayState(false)
		}
	}
	const shouldApplyMargins = () => windowWidth ? !!(shrinkPoint && sideBar && windowWidth > shrinkPoint) : false

	return (
		<MainDiv
			{...restProps}
			className={`flex h-full w-full ${clsx(className)}`}
			animate={{
				transition: {
					duration: 0.5
				}
			}}
			id="main">
			<>
				{sideBar && !shouldApplyMargins() ? (
					<Backdrop {...{ dark }}
					          active={overlayState}
					          id="overlay-background"
					          role="presentation"
					          {...backdropProps}
					          onClick={(event) => {
						          overlayAction()
						          !!backdropProps?.onClick && backdropProps?.onClick(event)
					          }}/>
				) : null}
				{children}
			</>
		</MainDiv>
	)
}

export default withTheme(Main)
