"use client";
import styled from "@emotion/styled";
import { css, withTheme } from "@emotion/react";
import theme from "../../Utils/theme";
import tw from "twin.macro";
import {ColorsForState} from "../Buttons/Button";
import {HTMLMotionProps, motion} from "framer-motion";
import {shouldForwardProp} from "../../Utils/StyledUtils";
import {useEffect, useRef, useState} from "react";

interface ListItemProps {
	autoFocus?: boolean
	clickable?: boolean
	colorsForState?: ColorsForState
	colorsForStateDark?: ColorsForState
	nested?: boolean
	dark?: boolean
}

const ListItem = styled((props: HTMLMotionProps<'li'> & ListItemProps) => {
	const {autoFocus, clickable, ...restProps} = props

	const [isFocused, setIsFocused] = useState(false)
	const listItemRef = useRef<HTMLLIElement>(null)

	useEffect(() => {
		if (props.clickable && props.autoFocus) {
			setIsFocused(true)
			listItemRef.current!.focus()
		}
	}, [props.clickable, props.autoFocus])


	return (
		<motion.li
			ref={listItemRef}
			onKeyDown={(e) => {
				if (props.clickable && isFocused && e.key === 'Enter' || e.key === ' ') {
					e.preventDefault()
					props.onClick?.(e as any)
				}
				if (props.onKeyDown) props.onKeyDown(e as any)
			}}
			onFocus={(e) => {
				setIsFocused(true)
				if (props.onFocus) props.onFocus(e)
			}}
			onBlur={(e) => {
				setIsFocused(false)
				if (props.onBlur) props.onBlur(e)
			}}
			tabIndex={props.clickable ? 0 : undefined}
			{...restProps}/>
	)
}, {
	shouldForwardProp: (props) => shouldForwardProp<ListItemProps>([
		"dark",
		"nested",
		"colorsForState",
		"colorsForStateDark"]
	)(props as keyof ListItemProps)
})((
	{
		colorsForState = theme.colorSchemeByState.light2,
		colorsForStateDark = theme.colorSchemeByState.overlaysDark2,
		clickable,
		nested,
		dark
	}: ListItemProps) => [
	tw`py-3`,

	nested ? tw`pl-4` : tw`px-4`,

	css`
    outline: 0;
    background-color: ${colorsForState!.default};
	`,

	clickable && css`
    &:hover {
      cursor: pointer;
      background-color: ${colorsForState!.hover};
    }

    &:focus {
      background-color: ${colorsForState!.hover};
    }

    &:active {
      background-color: ${colorsForState!.active};
    }

    &:disabled {
      background-color: ${colorsForState!.lightDisabled};

      & > * {
        color: ${colorsForStateDark!.lightDisabledText};
      }
    }
	`,

	(props) => (dark || props.theme.isDark) && css`
    background-color: ${colorsForStateDark!.default};

    ${clickable && css`
      &:hover {
        cursor: pointer;
        background-color: ${colorsForStateDark!.hover};
      }

      &:focus {
        background-color: ${colorsForStateDark!.hover};
      }

      &:active {
        background-color: ${colorsForStateDark!.active};
      }

      &:disabled {
        background-color: ${colorsForStateDark!.darkDisabled};

        & > * {
          color: ${colorsForStateDark!.darkDisabledText};
        }
      }
    `}
	`,
])

export default withTheme(ListItem)
