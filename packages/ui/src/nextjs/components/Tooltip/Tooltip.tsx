"use client";
import type { ReactNode } from "react"
import { useCallback, useEffect, useRef, useState } from "react"

import { css as rawCss } from "@emotion/css"
import { motion, AnimatePresence, type HTMLMotionProps } from "framer-motion"
import tw from "twin.macro"
import { LongPressDetectEvents, useLongPress } from "use-long-press"
import type { LongPressEvent } from "use-long-press/dist/types"

import { useIsDark, Typography, useMain } from "../../index"
import Portal from "../Portal/Portal"
import theme from "../../Utils/theme"
import TooltipContainer from "./TooltipContainer"
import { withTheme } from "@emotion/react"


type Placement = `${"top" | "bottom" | "center"}-${"left" | "right" | "center"}`


interface CalcPlacementProps {
	placement: Placement
	elementWidth: number
	elementHeight: number
	tooltipWidth: number
	tooltipHeight: number
	offsetX: number
	offsetY: number
}

const checkForFocusableChildren = (element: HTMLElement) => {
	const focusableChildren = element.querySelectorAll ("a, button, input, textarea, select, details, [tabindex]")
	return focusableChildren.length > 0
}

const calcPlacement = (
	{
		placement,
		elementWidth,
		elementHeight,
		tooltipWidth,
		tooltipHeight,
		offsetX,
		offsetY
	}: CalcPlacementProps
) => {
	let top = 0
	let left = 0
	const placementArr = placement.split ("-")

	if (placementArr[0] === "top") top = -(((elementHeight + tooltipHeight) / 2) + (offsetY))
	if (placementArr[0] === "bottom") top = ((elementHeight + tooltipHeight) / 2) + (offsetY)

	if (placementArr[1] === "left") left = -(((elementWidth + tooltipWidth) / 2) + (offsetX))
	if (placementArr[1] === "right") left = ((elementWidth + tooltipWidth) / 2) + (offsetX)

	return { left, top }
}

interface TooltipProps extends HTMLMotionProps<"div"> {
	dark?: boolean
	tooltip: ReactNode | number | string
	placement: Placement
	offsetX?: number
	offsetY?: number
	noShadow?: boolean
	elevation?: keyof typeof theme.shadows
	preventDefaultEvent?: boolean
	mobileTimeout?: number
	mobileThreshold?: number
	isClickableOnMobile?: boolean
	isPersistentOnMobile?: boolean
}

const Tooltip = (
	{
		children,
		tooltip,
		placement,
		dark = undefined,
		offsetX = 15,
		offsetY = 15,
		isClickableOnMobile = false,
		isPersistentOnMobile = false,
		preventDefaultEvent = true,
		mobileTimeout = 1000,
		mobileThreshold = 500,
		...restProps
	}: TooltipProps) => {
	const { isTouchable } = useMain ()


	const globalIsDarkMode = useIsDark ()
	const isDarkMode = dark || globalIsDarkMode
	const [visible, setVisible] = useState (false)
	const [top, setTop] = useState<number> ()
	const [left, setLeft] = useState<number> ()
	const elementWrapper = useRef<HTMLDivElement> (null)
	const tooltipElement = useRef<HTMLDivElement> (null)
	const [hasFocusableChild, setHasFocusableChild] = useState (false)

	const callback = useCallback ((event: LongPressEvent) => {
		preventDefaultEvent && event.preventDefault ()
		setVisible (true)
	}, [])

	const longPress = useLongPress (callback, {
		onFinish:         () => {
			if (isTouchable && !isPersistentOnMobile) {
				setTimeout (() => {
					setVisible (false)
				}, mobileTimeout)
			}
		},
		threshold:        mobileThreshold,
		captureEvent:     true,
		cancelOnMovement: false,
		detect:           LongPressDetectEvents.BOTH,
	})

	const setPosition = () => {
		if (elementWrapper.current && tooltipElement.current) {
			const { height, width } = elementWrapper.current.getBoundingClientRect ()
			const { width: tooltipWidth, height: tooltipHeight } = tooltipElement.current.getBoundingClientRect ()
			const { top, left } = {
				top:  elementWrapper.current.getBoundingClientRect ().top,
				left: elementWrapper.current.getBoundingClientRect ().left,
			}
			const { top: topOffset, left: leftOffset } = calcPlacement ({
				placement,
				elementWidth:  width,
				elementHeight: height,
				tooltipWidth,
				tooltipHeight,
				offsetX,
				offsetY,
			})

			const tooltipTop = top + (height / 2) - (tooltipHeight / 2) + topOffset
			const tooltipLeft = left + (width / 2) - (tooltipWidth / 2) + leftOffset

			const tooltipTopPreventOverflow = Math.min (Math.max (tooltipTop, 0), window.innerHeight - tooltipHeight)
			const tooltipLeftPreventOverflow = Math.min (Math.max (tooltipLeft, 0), window.innerWidth - tooltipWidth)

			setTop (() => tooltipTopPreventOverflow)
			setLeft (() => tooltipLeftPreventOverflow)
		}
	}

	const hide = () => {
		setVisible (false)
	}


	useEffect (() => {
		window.addEventListener ("scroll", setPosition)
		window.addEventListener ("resize", setPosition)
		return () => {
			window.removeEventListener ("scroll", setPosition)
			window.removeEventListener ("resize", setPosition)
		}
	}, [])

	useEffect (() => {
		if (elementWrapper.current) setHasFocusableChild (checkForFocusableChildren (elementWrapper.current))
	}, [elementWrapper])


	useEffect (() => {
		setPosition ()
		if (visible && isTouchable) document.body.addEventListener ("click", hide)

		return () => {
			if (isTouchable) document.body.addEventListener ("click", hide)
		}
	}, [visible])

	return (
		<>
			<AnimatePresence>
				{visible ? (
					<Portal>
						<TooltipContainer
							role="tooltip"
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							transition={{ duration: 0.1 }}
							top={top}
							left={left}
							dark={isDarkMode}
							{...restProps}
							ref={tooltipElement}>
							<Typography variant="small"
							            as={typeof tooltip === "string" ? "p" : "span"}
							            color={isDarkMode ? theme.colorScheme.accent : theme.colorScheme.body2}>
								{tooltip}
							</Typography>
						</TooltipContainer>
					</Portal>
				) : null}
			</AnimatePresence>
			<motion.div ref={elementWrapper}
			            className={rawCss`
                    ${tw`flex w-fit h-fit`};
			            `}
			            tabIndex={hasFocusableChild ? -1 : 0}
			            {...((isClickableOnMobile && isTouchable) && {
				            onClick: (event) => {
					            event.stopPropagation ()
					            setVisible (true)
					            if (isTouchable && !isPersistentOnMobile) setTimeout (() => setVisible (false), mobileTimeout)
				            },
			            })}
			            {...longPress ()}
			            onFocus={() => setVisible (true)}
			            onBlur={() => setVisible (false)}
			            onMouseEnter={() => !isTouchable && setVisible (true)}
			            onMouseLeave={() => !isTouchable && setVisible (false)}>
				{children}
			</motion.div>
		</>
	)
}

export default withTheme(Tooltip)
