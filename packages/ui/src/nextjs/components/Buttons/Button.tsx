"use client";

import { css, withTheme } from "@emotion/react"
import styled from "@emotion/styled"
import { motion } from "framer-motion"

import theme from "../../utils/theme"
import type { StyledFunction } from "../../types";
import { shouldForwardProp } from "../../utils/StyledUtils";
import { ColorByStateOptions, SingleColorOptions } from "../Theme/types"
import { getColorByStateFromPath, getSingleColorFromPath } from "../../utils/colors"
import tw from "twin.macro"

export interface ButtonProps {
	dark?: boolean
	color?: SingleColorOptions
	colorDark?: SingleColorOptions
	fab?: boolean
	icon?: boolean
	height?: string | number
	width?: string | number
	size?: string
	text?: boolean
	noShadow?: boolean
	elevation?: keyof typeof theme.shadows
	noPadding?: boolean
	colorsForStates?: ColorByStateOptions
	colorsForStatesDark?: ColorByStateOptions
}

export const ButtonStyles: StyledFunction<ButtonProps> = (
	{
		color,
		colorDark,
		dark,
		fab = false,
		icon = false,
		height = undefined,
		width = undefined,
		colorsForStates = "primary",
		colorsForStatesDark = "primary",
		elevation = 3,
		noPadding = false,
		noShadow = false,
		text = false,
		size = undefined,
		theme
	}
) => {
	const resolvedColorsForState = getColorByStateFromPath(colorsForStates, theme.config)
	const resolvedColorsForStateDark = getColorByStateFromPath(colorsForStatesDark, theme.config)
	const resolvedColor = getSingleColorFromPath(color, theme.config)
	const resolvedColorDark = getSingleColorFromPath(colorDark, theme.config)
	return [
		tw`rounded`,
		css`
          cursor: pointer;
          border: none;
		`,

		!noPadding && icon && css`
          padding: 4px;
		`,

		icon && css`
          width: fit-content;
          height: fit-content;
		`,

		!noPadding && !icon && css`
          padding: 8px 16px;
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
          box-shadow: ${theme.config.shadows[elevation]};
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
          color: ${resolvedColor};
          background-color: ${resolvedColorsForState.default};
          transition: all 100ms linear;

          * {
            transition: all 100ms linear;
          }

          &:hover {
            background-color: ${resolvedColorsForState.hover};
          }

          &:active {
            background-color: ${resolvedColorsForState.active};
          }

          &:disabled {
            * {
              color: ${resolvedColorsForState.lightDisabledText};
            }

            box-shadow: none;
            background-color: ${resolvedColorsForState.lightDisabled};
          }
		`,

		(props) => (!text && (dark || props.theme.isDark)) && css`
          background-color: ${resolvedColorsForStateDark.default};
          color: ${resolvedColorDark};

          &:hover {
            /** TODO: check this */
            color: white;
            background-color: ${resolvedColorsForStateDark.hover};
          }

          &:active {
            background-color: ${resolvedColorsForStateDark.active}
          }

          &:disabled {
            * {
              color: ${resolvedColorsForStateDark.darkDisabledText};
            }

            box-shadow: none;
            background-color: ${resolvedColorsForStateDark.darkDisabled};
          }
		`,

		text && css`
          color: ${resolvedColorsForState.default};

          * {
            transition: color 100ms ease-in-out;
          }

          & > * {
            color: ${resolvedColorsForState.default};
          }

          &:hover {
            & > * {
              color: ${resolvedColorsForState.hover};
            }
          }

          &:active {
            & > * {
              color: ${resolvedColorsForState.active};
            }
          }

          &:disabled {

            & > * {
              color: ${resolvedColorsForState.lightDisabledText};
            }
          }
		`,

		(props) => (text && (dark || props.theme.isDark)) && css`
          & > * {
            color: ${resolvedColorsForStateDark.default};
          }

          &:hover {
            & > * {
              color: ${resolvedColorsForStateDark.hover};
            }
          }

          &:active {
            & > * {
              color: ${resolvedColorsForStateDark.active}
            }
          }

          &:disabled {
            & > * {
              color: ${resolvedColorsForStateDark.darkDisabledText};
            }
          }
		`
	]
}

export const buttonPropsArray: (keyof ButtonProps)[] = [
	"colorsForStates",
	"color",
	"colorDark",
	"elevation",
	"noShadow",
	"noPadding",
	"text",
	"icon",
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

export default withTheme (Button)


