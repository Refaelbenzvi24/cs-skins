"use client";
import { HTMLMotionProps, motion } from "framer-motion"
import { useEffect, useState } from "react"
import styled from "@emotion/styled"
import { SingleColorOptions, ZIndexOptions } from "../Theme/types"
import tw from "twin.macro"
import { css, withTheme } from "@emotion/react"
import { getCssUnit, getSingleColorFromPath, getZIndexFromPath } from "../../Utils/colors"
import { StyledProps } from "../../types"
import { shouldForwardProp } from "../../Utils/StyledUtils"
import clsx from "clsx"


interface StyledSimpleSideBarProps {
	shrinkPoint?: number | string
	backgroundColor?: SingleColorOptions
	backgroundColorDark?: SingleColorOptions
	width?: number | string
	dark?: boolean
	zIndex?: ZIndexOptions
}

const StyledSimpleSideBar = withTheme(styled(motion.div, {
	shouldForwardProp: (props) => shouldForwardProp<StyledSimpleSideBarProps>(
		["shrinkPoint", "backgroundColor", "backgroundColorDark", "dark", "zIndex"]
	)(props as keyof StyledSimpleSideBarProps)
})(({
	shrinkPoint,
	backgroundColor = "colorScheme.accent",
	backgroundColorDark = "colorScheme.overlaysDark",
	dark,
	zIndex = "sideBar",
	width = 280,
	...restProps
}: StyledSimpleSideBarProps) => {
	const { theme }                   = restProps as StyledProps
	const resolvedZIndex              = getZIndexFromPath(zIndex, theme.config)
	const resolvedBackgroundColor     = getSingleColorFromPath(backgroundColor, theme.config)
	const resolvedBackgroundColorDark = getSingleColorFromPath(backgroundColorDark, theme.config)
	return [
		tw`fixed h-full`,

		css`
			z-index: ${resolvedZIndex};
			background-color: ${resolvedBackgroundColor};
			width: ${getCssUnit(width)};
			box-shadow: ${theme.config.shadows[4]};

			& ~ #main {
				[dir="ltr"] & {
					padding-left: ${getCssUnit(width)};
					transition: padding-left 0.4s ease-in-out;
				}

				[dir="rtl"] & {
					padding-right: ${getCssUnit(width)};
					transition: padding-right 0.4s ease-in-out;
				}
			}
		`,

		(props) => (dark || props.theme.isDark) && css`
			background-color: ${resolvedBackgroundColorDark};
		`,
	]
}))

interface SimpleSideBarProps extends StyledSimpleSideBarProps {
	onChange?: (value: boolean) => void
	value?: boolean
	minimizedSize?: number | string
}


const SimpleSideBar = (
	{
		className,
		children,
		width = 280,
		minimizedSize = 75,
		value,
		onChange,
		...restProps
	}: SimpleSideBarProps & HTMLMotionProps<"div">) => {
	const [isOpen, setIsOpen] = useState(value)

	useEffect(() => {
		setIsOpen(value)
	}, [value]);

	const toggle = () => {
		setIsOpen(!isOpen)
		if(onChange) onChange(!isOpen)
	}

	return (
		<StyledSimpleSideBar className={clsx(className)}
		                     width={isOpen ? width : minimizedSize}
		                     animate={{
			                     width:      isOpen ? getCssUnit(width) : getCssUnit(minimizedSize),
			                     transition: { duration: 0.4 }
		                     }}
		                     {...restProps}>
			{children}
		</StyledSimpleSideBar>
	)
}

export default SimpleSideBar
