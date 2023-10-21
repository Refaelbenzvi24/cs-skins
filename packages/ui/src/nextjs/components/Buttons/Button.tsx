"use client";
import type { CSSProperties } from "react"

import { css, withTheme } from "@emotion/react"
import styled from "@emotion/styled"
import { motion } from "framer-motion"

import theme from "../../Utils/theme"
import type { StyledFunction } from "../../types";
import { shouldForwardProp } from "../../Utils/StyledUtils";


export interface ColorsForState {
	default: string
	hover?: string
	active?: string
	lightDisabled?: string
	darkDisabled?: string
	lightDisabledText?: string
	darkDisabledText?: string
}

export interface ButtonProps {
	dark?: boolean
	color?: string
	fab?: boolean
	icon?: boolean
	height?: string | number
	width?: string | number
	size?: string
	text?: boolean
	noShadow?: boolean
	elevation?: keyof typeof theme.shadows
	noPadding?: boolean
	bgColor?: CSSProperties["backgroundColor"]
	bgColorDark?: CSSProperties["backgroundColor"]
	colorsForStates?: ColorsForState
	colorsForStatesDark?: ColorsForState
}

export const ButtonStyles: StyledFunction<ButtonProps> = (
	{
		color,
		bgColor,
		bgColorDark,
		dark,
		fab = false,
		icon = false,
		height = undefined,
		width = undefined,
		colorsForStates = theme.colorSchemeByState.primary,
		colorsForStatesDark = theme.colorSchemeByState.primary,
		elevation = 3,
		noPadding = false,
		noShadow = false,
		text = false,
		size = undefined
	}
) => [
	css`
      cursor: pointer;
      border: none;
	`,

	icon && css`
      padding: 4px;
      width: fit-content;
      height: fit-content;
	`,

	!icon && css`
      padding: 8px 16px;
	`,
	noPadding && css`
      padding: 0;
	`,

	fab && css`
      border-radius: 9999px;
	`,

	height && css`
      height: ${typeof height === "number" ? `${height}px` : height};
	`,

	width && css`
      width: ${typeof width === "number" ? `${width}px` : width};
	`,

	!width && icon && css`
      width: fit-content;
	`,

	!height && icon && css`
      height: fit-content;
	`,

	size && css`
      font-size: ${size};
	`,


	(!icon && !text && !noShadow) && css`
      box-shadow: ${theme.shadows[elevation || 3]};
	`,

	icon && css`
      display: flex;

      * {
        width: ${size};
        height: ${size};
      }
	`,

	css`
      &:disabled {
        cursor: default;
      }
	`,

	!text && css`
      color: ${color || theme.colors.gray_900};
      background-color: ${colorsForStates?.default || bgColor || theme.colors.gray_200};
      transition: all 100ms linear;

      * {
        transition: all 100ms linear;
      }

      &:hover {
        background-color: ${colorsForStates?.hover || theme.colors.light_700};
      }

      &:active {
        background-color: ${colorsForStates?.active || theme.colors.light_600};
      }

      &:disabled {
        * {
          color: ${colorsForStates?.lightDisabledText || theme.colors.gray_600};
        }

        box-shadow: none;
        background-color: ${colorsForStates?.lightDisabled || theme.colors.gray_200};
      }
	`,

	(props) => (!text && (dark || props.theme.isDark)) && css`
      background-color: ${colorsForStatesDark?.default || bgColorDark || theme.colors.dark_400};
      color: ${color || theme.colors.gray_200};

      &:hover {
        color: ${theme.colors.white};
        background-color: ${colorsForStatesDark?.hover || theme.colors.dark_200};
      }

      &:active {
        background-color: ${colorsForStatesDark?.active || theme.colors.dark_100}
      }

      &:disabled {
        * {
          color: ${colorsForStatesDark?.darkDisabledText || theme.colors.gray_600};
        }

        box-shadow: none;
        background-color: ${colorsForStatesDark?.darkDisabled || theme.colors.dark_400};
      }
	`,

	text && css`
      color: ${colorsForStates?.default || color || theme.colors.gray_200};

      * {
        transition: color 100ms ease-in-out;
      }

      & > * {
        color: ${colorsForStates?.default || color || theme.colors.gray_200};
      }

      &:hover {
        & > * {
          color: ${colorsForStates?.hover || theme.colors.light_700};
        }
      }

      &:active {
        & > * {
          color: ${colorsForStates?.active || theme.colors.light_600};
        }
      }

      &:disabled {

        & > * {
          color: ${colorsForStates?.lightDisabledText || theme.colors.gray_200};
        }
      }
	`,

	(props) => (text && (dark || props.theme.isDark)) && css`
      & > * {
        color: ${colorsForStatesDark?.default || color || theme.colors.dark_400};
      }

      &:hover {
        & > * {
          color: ${colorsForStatesDark?.hover || theme.colors.dark_200};
        }
      }

      &:active {
        & > * {
          color: ${colorsForStatesDark?.active || theme.colors.dark_100}
        }
      }

      &:disabled {
        & > * {
          color: ${colorsForStatesDark?.darkDisabledText || theme.colors.gray_200};
        }
      }
	`
]

export const buttonPropsArray: (keyof ButtonProps)[] = [
	"colorsForStates",
	"color",
	"elevation",
	"noShadow",
	"noPadding",
	"text",
	"icon",
	"bgColor",
	"bgColorDark",
	"colorsForStatesDark",
	"height",
	"size",
	"width",
	"fab",
	"dark"
]

const Button = styled (motion.button, {
	shouldForwardProp: (props) => shouldForwardProp<ButtonProps> (
		buttonPropsArray
	) (props as keyof ButtonProps)
}) (ButtonStyles)

export default withTheme(Button)


