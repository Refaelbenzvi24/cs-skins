import { shouldForwardProp } from "../../Utils/StyledUtils"
import { css, withTheme } from "@emotion/react"
import tw from "twin.macro"
import styled from "@emotion/styled"
import type { DisabledStateOptions, SingleColorOptions } from "../Theme/types"
import { getDisabledColorFromPath, getSingleColorFromPath } from "../../Utils/colors"
import { StyledProps } from "../../types"
import { getMargins, MarginsObject } from "../../styles/emotion"

export interface TextAreaInputProps {
	dark?: boolean
	minHeight?: string
	centered?: boolean
	removeShadow?: boolean
	backgroundColor?: SingleColorOptions
	backgroundColorDark?: SingleColorOptions
	backgroundColorDisabled?: SingleColorOptions
	backgroundColorDisabledDark?: DisabledStateOptions
	hasBeforeIcon?: boolean
	margins?: MarginsObject
}

export const TextAreaInput = styled ("textarea", {
	shouldForwardProp: (props) => shouldForwardProp<TextAreaInputProps> (
		["dark", "centered", "minHeight", "hasBeforeIcon", "removeShadow", "margins", "backgroundColor", "backgroundColorDark", "backgroundColorDisabled", "backgroundColorDisabledDark"]
	) (props as keyof TextAreaInputProps)
}) ((
	{
		dark,
		minHeight,
		centered,
		backgroundColor = "colorScheme.accent",
		backgroundColorDark = "colorScheme.overlaysDark",
		backgroundColorDisabled = "lightDisabled",
		backgroundColorDisabledDark = "darkDisabled",
		removeShadow,
		hasBeforeIcon,
		margins,
		...restProps
	}: TextAreaInputProps) => {
	const {theme} = restProps as StyledProps
	const resolvedBackgroundColor = getSingleColorFromPath (backgroundColor, theme.config)
	const resolvedDarkBackgroundColor = getSingleColorFromPath (backgroundColorDark, theme.config)
	const resolvedBackgroundColorDisabled = getDisabledColorFromPath (backgroundColorDisabled, theme.config.disabledState)
	const resolvedBackgroundColorDisabledDark = getDisabledColorFromPath (backgroundColorDisabledDark, theme.config.disabledState)
	return [
		tw`w-full py-[7px] border-0 place-self-center h-[45px] min-h-[45px] rounded`,

		hasBeforeIcon ? tw`ltr:pl-[54px] rtl:pr-[54px] ltr:pr-[10px] rtl:pl-[10px]` : tw`ltr:pl-[22px] rtl:pr-[22px] ltr:pr-[10px] rtl:pl-[10px]`,

		minHeight && css`
          min-height: ${minHeight};
		`,
		centered && tw`text-center`,

		getMargins(margins),

		css`
          background-color: ${resolvedBackgroundColor};
          color: ${theme.config.colorScheme.header2};
          resize: none;
          box-shadow: ${theme.config.shadows["2"]};
          font-weight: ${500};
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

		(props) => (dark || props.theme.isDark) && css`
          background-color: ${resolvedDarkBackgroundColor};
          color: ${theme.config.colorScheme.accent};

          &:disabled {
            background-color: ${resolvedBackgroundColorDisabledDark};
            color: ${theme.config.colorSchemeByState.overlaysDark.darkDisabledText};
          }
		`,
	]
})

export default withTheme (TextAreaInput)
