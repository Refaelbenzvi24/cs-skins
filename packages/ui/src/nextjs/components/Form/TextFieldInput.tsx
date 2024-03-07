import { shouldForwardProp } from "../../utils/StyledUtils"
import { css, withTheme } from "@emotion/react"
import tw from "twin.macro"
import styled from "@emotion/styled"
import type { DisabledStateOptions, SingleColorOptions } from "../Theme/types"
import { getDisabledColorFromPath, getSingleColorFromPath } from "../../utils/colors"
import type { StyledProps } from "../../types"
import { getMargins, MarginsObject } from "../../styles/emotion"
import { motion } from "framer-motion"


export interface TextFieldInputProps {
	dark?: boolean
	height?: string
	centered?: boolean
	removeShadow?: boolean
	backgroundColor?: SingleColorOptions
	backgroundColorDark?: SingleColorOptions
	backgroundColorDisabled?: SingleColorOptions
	backgroundColorDisabledDark?: DisabledStateOptions
	hasBeforeIcon?: boolean
	margins?: MarginsObject
}

export const TextFieldInput = styled(motion.input, {
	shouldForwardProp: (props) => shouldForwardProp<TextFieldInputProps>(
		["dark", "height", "centered", "hasBeforeIcon", "removeShadow", "margins", "backgroundColor", "backgroundColorDark",
			"backgroundColorDisabled", "backgroundColorDisabledDark"]
	)(props as keyof TextFieldInputProps)
})(({
		dark,
		height,
		centered,
		backgroundColor = "colorScheme.accent",
		backgroundColorDark = "colorScheme.overlaysDark",
		backgroundColorDisabled = "lightDisabled",
		backgroundColorDisabledDark = "darkDisabled",
		removeShadow,
		hasBeforeIcon,
		margins,
		...restProps
	}: TextFieldInputProps
) => {
	const { theme }                           = restProps as StyledProps
	const resolvedBackgroundColor             = getSingleColorFromPath(backgroundColor, theme.config)
	const resolvedDarkBackgroundColor         = getSingleColorFromPath(backgroundColorDark, theme.config)
	const resolvedBackgroundColorDisabled     = getDisabledColorFromPath(backgroundColorDisabled, theme.config.disabledState)
	const resolvedBackgroundColorDisabledDark = getDisabledColorFromPath(backgroundColorDisabledDark, theme.config.disabledState)
	return [
		tw`w-full py-[7px] resize-none place-self-center rounded`,

		hasBeforeIcon ? tw`ltr:pl-[54px] rtl:pr-[54px] ltr:pr-[10px] rtl:pl-[10px]` : tw`ltr:pl-[22px] rtl:pr-[22px] ltr:pr-[10px] rtl:pl-[10px]`,

		centered && tw`text-center`,

		({ theme }) => removeShadow ? "" : css`
			box-shadow: ${theme.config.shadows["2"]};
		`,

		getMargins(margins),

		css`
			background-color: ${resolvedBackgroundColor};
			color: ${theme.config.colorScheme.header2};
			font-weight: ${500};
			height: ${height};
			font-size: 1rem;
			line-height: 140%;
			transition: background-color 0.2s linear;

			&:disabled {
				background-color: ${resolvedBackgroundColorDisabled};
				color: ${theme.config.colorSchemeByState.overlaysDark.lightDisabledText};
			}

			&:focus {
				${removeShadow ? "" : css`
					box-shadow: ${theme.config.shadows["3"]};
				`};

				${tw`outline-none ring-transparent`}
			}

			::placeholder {
				color: ${theme.config.colorScheme.subtitle1};
				opacity: 0.8;
			}

			:-ms-input-placeholder {
				color: ${theme.config.colorScheme.subtitle1};
				opacity: 0.8;
			}

			::-ms-input-placeholder {
				color: ${theme.config.colorScheme.subtitle1};
				opacity: 0.8;
			}
		`,

		(dark || theme.isDark) && css`
			background-color: ${resolvedDarkBackgroundColor};
			color: ${theme.config.colorScheme.accent};

			&:disabled {
				background-color: ${resolvedBackgroundColorDisabledDark};
				color: ${theme.config.colorSchemeByState.overlaysDark.darkDisabledText};
			}
		`,
	]
})

export default withTheme(TextFieldInput)
