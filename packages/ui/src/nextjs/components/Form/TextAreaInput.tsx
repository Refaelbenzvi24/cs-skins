import { shouldForwardProp } from "../../Utils/StyledUtils"
import { css, withTheme } from "@emotion/react"
import theme from "../../Utils/theme"
import tw from "twin.macro"
import styled from "@emotion/styled"

export interface TextAreaInputProps {
	dark?: boolean
	minHeight?: string
	centered?: boolean
	removeShadow?: boolean
	bgColor?: string
	bgColorDark?: string
	bgColorDisabled?: string
	bgColorDisabledDark?: string
	hasBeforeIcon?: boolean
}

export const TextAreaInput = styled('textarea', {
	shouldForwardProp: (props) => shouldForwardProp<TextAreaInputProps>(
		['dark', 'centered', 'minHeight', 'hasBeforeIcon', 'removeShadow', 'bgColor', 'bgColorDark', 'bgColorDisabled', 'bgColorDisabledDark']
	)(props as keyof TextAreaInputProps)
})((
	{
		dark,
		minHeight,
		centered,
		bgColor,
		bgColorDark,
		bgColorDisabled,
		bgColorDisabledDark,
		removeShadow,
		hasBeforeIcon
	}: TextAreaInputProps) => [
	tw`w-full py-[7px] border-0 place-self-center h-[45px] min-h-[45px]`,

	hasBeforeIcon ? tw`ltr:pl-[54px] rtl:pr-[54px] ltr:pr-[10px] rtl:pl-[10px]` : tw`ltr:pl-[22px] rtl:pr-[22px] ltr:pr-[10px] rtl:pl-[10px]`,

	minHeight && css`
    min-height: ${minHeight};
	`,
	centered && tw`text-center`,

	css`
    background-color: ${bgColor};
    color: ${theme.colorScheme.header2};
    resize: none;
    box-shadow: ${theme.shadows["2"]};
    font-weight: ${500};
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
])

export default withTheme(TextAreaInput)
