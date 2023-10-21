import { shouldForwardProp } from "../../Utils/StyledUtils"
import { css, withTheme } from "@emotion/react"
import theme from "../../Utils/theme"
import tw from "twin.macro"
import styled from "@emotion/styled"

export interface TextFieldInputProps {
	dark?: boolean
	height?: string
	centered?: boolean
	removeShadow?: boolean
	bgColor?: string
	bgColorDark?: string
	bgColorDisabled?: string
	bgColorDisabledDark?: string
	hasBeforeIcon?: boolean
}

export const TextFieldInput = styled('input', {
	shouldForwardProp: (props) => shouldForwardProp<TextFieldInputProps>(
		['dark', 'height', 'centered', 'hasBeforeIcon', 'removeShadow', 'bgColor', 'bgColorDark', 'bgColorDisabled', 'bgColorDisabledDark']
	)(props as keyof TextFieldInputProps)
})(({
	    dark,
	    height,
	    centered,
	    bgColor = theme.colorScheme.accent,
	    bgColorDark = theme.colorScheme.overlaysDark,
	    bgColorDisabled = theme.colorSchemeByState.accent.lightDisabled,
	    bgColorDisabledDark = theme.colorSchemeByState.overlaysDark.darkDisabled,
	    removeShadow,
	    hasBeforeIcon
    }:
	    TextFieldInputProps
	) =>
		[
			tw`w-full py-[7px] resize-none place-self-center`,

			hasBeforeIcon ? tw`ltr:pl-[54px] rtl:pr-[54px] ltr:pr-[10px] rtl:pl-[10px]` : tw`ltr:pl-[22px] rtl:pr-[22px] ltr:pr-[10px] rtl:pl-[10px]`,

			centered && tw`text-center`,

			removeShadow ? '' : css`
              box-shadow: ${theme.shadows["2"]};
			`,

			css`
              background-color: ${bgColor};
              color: ${theme.colorScheme.header2};
              font-weight: ${500};
              height: ${height};
              font-size: 1rem;
              line-height: 140%;
              transition: background-color 0.2s linear;

              &:disabled {
                background-color: ${bgColorDisabled};
                color: ${theme.colorSchemeByState.overlaysDark.lightDisabledText};
              }

              &:focus {
                ${removeShadow ? '' : css`
                  box-shadow: ${theme.shadows["3"]};
                `};

                ${tw`outline-none ring-transparent`}
              }

              ::placeholder {
                color: ${theme.colorScheme.subtitle1};
                opacity: 0.8;
              }

              :-ms-input-placeholder {
                color: ${theme.colorScheme.subtitle1};
                opacity: 0.8;
              }

              ::-ms-input-placeholder {
                color: ${theme.colorScheme.subtitle1};
                opacity: 0.8;
              }
			`,

			(props) => (dark || props.theme.isDark) && css`
              background-color: ${bgColorDark};
              color: ${theme.colorScheme.accent};

              &:disabled {
                background-color: ${bgColorDisabledDark};
                color: ${theme.colorSchemeByState.overlaysDark.darkDisabledText};
              }
			`,
		]
)

export default withTheme(TextFieldInput)
