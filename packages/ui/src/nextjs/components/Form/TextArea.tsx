import {type FormEvent, forwardRef, useEffect, useRef, useState} from "react"

import {css as classCss} from "@emotion/css"
import {css} from "@emotion/react"
import styled from "@emotion/styled"
import autoAnimate from '@formkit/auto-animate'
import clsx from "clsx"
import tw from "twin.macro"
import {mergeRefs} from "react-merge-refs"

import theme from "../../Utils/theme"
import ConditionalLabel from "./ConditionalLabel"
import HelperText, {type HelperTextProps} from "./HelperText"
import Label, {type LabelProps} from "./Label";
import {shouldForwardProp} from "../../Utils/StyledUtils";
import BeforeIconWrapper from "./BeforeIconWrapper";

interface TextAreaInputProps {
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

interface TextAreaProps extends React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
	persistentLabel?: boolean
	value?: string | readonly string[] | number | undefined
	error?: boolean
	helperText?: string
	label?: string
	labelProps?: LabelProps
	beforeIcon?: () => React.ReactNode
	helperTextProps?: HelperTextProps
}

const defaultProps = {
	placeholder: undefined,
	centered: false,
	persistentLabel: false,
	value: undefined,
	error: false,
	dark: undefined,
	minHeight: '150px',
	beforeIcon: undefined,
	helperText: undefined,
	label: undefined,
	labelProps: Label.defaultProps,
	helperTextProps: HelperText.defaultProps,
	bgColor: theme.colorScheme.accent,
	bgColorDark: theme.colorScheme.overlaysDark,
	bgColorDisabled: theme.colorSchemeByState.accent.lightDisabled,
	bgColorDisabledDark: theme.colorSchemeByState.overlaysDark.darkDisabled
} as const

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps & TextAreaInputProps>((props, ref) => {
	const {
		className,
		label,
		placeholder,
		minHeight,
		persistentLabel,
		value,
		error,
		helperText,
		labelProps,
		onInput,
		helperTextProps,
		required,
		beforeIcon,
		...restProps
	} = props
	
	const [localValue, setLocalValue] = useState<string | readonly string[] | number>('')
	
	const sectionRef = useRef<HTMLTextAreaElement | null>(null)
	const textareaRef = useRef<HTMLTextAreaElement | null>(null)
	
	const requiredStar = `${required ? '*' : ''}`
	const localLabel = `${label ? `${label}${requiredStar}` : ''}`
	const localPlaceholder = `${placeholder ? `${placeholder}${requiredStar}` : (!persistentLabel ? localLabel : '') || ''}`
	
	const handleAutoGrow = () => {
		if (textareaRef?.current && textareaRef.current instanceof HTMLTextAreaElement) {
			textareaRef.current.style.height = "0px"
			const scrollHeight = textareaRef.current.scrollHeight + 5
			textareaRef.current.style.height = `${scrollHeight}px`
		}
	}
	
	useEffect(() => {
		if (sectionRef.current !== null) autoAnimate(sectionRef.current)
	}, [sectionRef])
	
	useEffect(() => {
		handleAutoGrow()
	}, [localValue])
	
	useEffect(() => {
		if (typeof value === 'string') setLocalValue(value)
	}, [value])
	
	useEffect(() => {
		if (textareaRef.current) setLocalValue(() => textareaRef.current!.value || value || '')
	}, [textareaRef.current?.value])
	
	return (
		<section className="flex flex-col" ref={sectionRef}>
			<ConditionalLabel
				condition={persistentLabel ? true : !!localValue}
				label={localLabel}
				{...{...labelProps}}/>
			
			{beforeIcon && (
				<div className="relative">
					<BeforeIconWrapper
						className={classCss`
							${tw`pt-[7px]`};
							${(localValue && label) || (label && persistentLabel) ? tw`mt-0` : typeof label === 'undefined' ? tw`mt-0` : (labelProps?.hasBackground ? tw`mt-[24px]` : tw`mt-[20px]`)};
						`}>
						{beforeIcon()}
					</BeforeIconWrapper>
				</div>
			)}
			
			<TextAreaInput {...restProps}
			               ref={mergeRefs([textareaRef, ref])}
			               hasBeforeIcon={!!beforeIcon}
			               minHeight={minHeight}
			               className={`${classCss`
				                ${(localValue && label) || (label && persistentLabel) ? tw`mt-0` : typeof label === 'undefined' ? tw`mt-0` : (labelProps?.hasBackground ? tw`mt-[24px]` : tw`mt-[20px]`)}
				                ${helperText ? tw`mb-0` : typeof helperText === 'undefined' ? tw`mb-0` : (helperTextProps?.hasBackground ? tw`mb-[26px]` : tw`mb-[24px]`)}
			                `} ${clsx(className ?? '')}`}
			               onInput={(event: FormEvent<HTMLTextAreaElement> & { target: HTMLInputElement }) => {
				               setLocalValue(event.target.value)
				               if (onInput) onInput(event)
			               }}
			               placeholder={localPlaceholder}
			               value={localValue}/>
			
			{!!helperText && (
				<HelperText {...{...helperTextProps, error}}>
					{helperText}
				</HelperText>
			)}
		</section>
	)
})

TextArea.defaultProps = defaultProps
TextArea.displayName = 'TextArea'

export default TextArea
