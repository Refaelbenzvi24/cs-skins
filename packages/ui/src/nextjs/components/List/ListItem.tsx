"use client";
import styled from "@emotion/styled";
import { css, withTheme } from "@emotion/react";
import theme from "../../utils/theme";
import tw from "twin.macro";
import { HTMLMotionProps, motion } from "framer-motion";
import { shouldForwardProp } from "../../utils/StyledUtils";
import { useEffect, useRef, useState } from "react";
import { ColorByStateOptions } from "../Theme/types"
import { getColorByStateFromPath } from "../../utils/colors"
import { StyledProps } from "../../types"


interface ListItemProps extends StyledProps {
	autoFocus?: boolean
	clickable?: boolean
	colorsForStates?: ColorByStateOptions
	colorsForStatesDark?: ColorByStateOptions
	nested?: boolean
	dark?: boolean
}

const ListItem = styled((props: HTMLMotionProps<'li'> & Omit<ListItemProps, 'theme'>) => {
	const { autoFocus, clickable, ...restProps } = props

	const [isFocused, setIsFocused] = useState(false)
	const listItemRef               = useRef<HTMLLIElement>(null)

	useEffect(() => {
		if(props.clickable && props.autoFocus){
			setIsFocused(true)
			listItemRef.current!.focus()
		}
	}, [props.clickable, props.autoFocus])


	return (
		<motion.li
			ref={listItemRef}
			onKeyDown={(e) => {
				if(props.clickable && isFocused && e.key === 'Enter' || e.key === ' '){
					e.preventDefault()
					props.onClick?.(e as any)
				}
				if(props.onKeyDown) props.onKeyDown(e as any)
			}}
			onFocus={(e) => {
				setIsFocused(true)
				if(props.onFocus) props.onFocus(e)
			}}
			onBlur={(e) => {
				setIsFocused(false)
				if(props.onBlur) props.onBlur(e)
			}}
			tabIndex={props.clickable ? 0 : undefined}
			{...restProps}/>
	)
}, {
	shouldForwardProp: (props) => shouldForwardProp<ListItemProps>([
		"dark",
		"nested",
		"colorsForStates",
		"colorsForStatesDark"]
	)(props as keyof ListItemProps)
})((
	{
		colorsForStates = 'light2',
		colorsForStatesDark = 'overlaysDark2',
		clickable,
		nested,
		dark,
		theme
	}: ListItemProps) => {
	const resolvedColorsForState = getColorByStateFromPath(colorsForStates, theme.config)
	const resolvedColorsForStateDark = getColorByStateFromPath(colorsForStatesDark, theme.config)
	return [
		tw`py-3`,

		nested ? tw`pl-4` : tw`px-4`,

		css`
			outline: 0;
			background-color: ${resolvedColorsForState.default};
		`,

		clickable && css`
			&:hover {
				cursor: pointer;
				background-color: ${resolvedColorsForState.hover};
			}

			&:focus {
				background-color: ${resolvedColorsForState.hover};
			}

			&:active {
				background-color: ${resolvedColorsForState.active};
			}

			&:disabled {
				background-color: ${resolvedColorsForState.lightDisabled};

				& > * {
					color: ${resolvedColorsForState.lightDisabledText};
				}
			}
		`,

		(props) => (dark || props.theme.isDark) && css`
			background-color: ${resolvedColorsForStateDark.default};

			${clickable && css`
				&:hover {
					cursor: pointer;
					background-color: ${resolvedColorsForStateDark.hover};
				}

				&:focus {
					background-color: ${resolvedColorsForStateDark.hover};
				}

				&:active {
					background-color: ${resolvedColorsForStateDark.active};
				}

				&:disabled {
					background-color: ${resolvedColorsForStateDark.darkDisabled};

					& > * {
						color: ${resolvedColorsForStateDark.darkDisabledText};
					}
				}
			`}
		`,
	]
})

export default withTheme(ListItem)
