import {forwardRef, useEffect, useRef, useState, type FormEvent, FC, ChangeEvent} from "react"

import {css as classCss} from "@emotion/css"
import {css} from "@emotion/react"
import styled from "@emotion/styled"
import autoAnimate from '@formkit/auto-animate'
import clsx from "clsx"
import tw from "twin.macro"

import theme from "../../Utils/theme"
import ConditionalLabel from "./ConditionalLabel"
import HelperText, {type HelperTextProps} from "./HelperText"
import Label, {type LabelProps} from "./Label"
import {shouldForwardProp} from "../../Utils/StyledUtils";
import {mergeRefs} from "react-merge-refs"
import BeforeIconWrapper from "./BeforeIconWrapper";

interface TextFieldInputProps {
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
	    bgColor,
	    bgColorDark,
	    bgColorDisabled,
	    bgColorDisabledDark,
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


interface TextFieldProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
	placeholder?: string
	persistentLabel?: boolean
	centered?: boolean
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
	persistentLabel: false,
	value: undefined,
	error: false,
	helperText: undefined,
	label: undefined,
	beforeIcon: undefined,
	labelProps: Label.defaultProps,
	helperTextProps: HelperText.defaultProps,
	bgColor: theme.colorScheme.accent,
	bgColorDark: theme.colorScheme.overlaysDark,
	bgColorDisabled: theme.colorSchemeByState.accent.lightDisabled,
	bgColorDisabledDark: theme.colorSchemeByState.overlaysDark.darkDisabled
} as const

const TextField = forwardRef<HTMLInputElement, TextFieldProps & Omit<TextFieldInputProps, 'hasBeforeIcon'>>((props, ref) => {
	const {
		label,
		className,
		persistentLabel,
		placeholder,
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
	
	const sectionRef = useRef<HTMLInputElement | null>(null)
	const inputRef = useRef<HTMLInputElement | null>(null)
	
	const requiredStar = `${required ? '*' : ''}`
	const localLabel = `${label ? `${label}${requiredStar}` : ''}`
	const localPlaceholder = `${placeholder ? `${placeholder}${requiredStar}` : (!persistentLabel ? localLabel : '') || ''}`
	
	useEffect(() => {
		if (sectionRef.current !== null) autoAnimate(sectionRef.current)
	}, [sectionRef])
	
	useEffect(() => {
		if (typeof value === 'string') setLocalValue(value)
	}, [value])
	
	useEffect(() => {
		if (inputRef.current) setLocalValue(() => inputRef.current!.value || value || '')
	}, [inputRef.current?.value])
	return (
		<section className="flex flex-col" ref={sectionRef}>
			<ConditionalLabel
				condition={persistentLabel ? true : !!localValue}
				label={localLabel}
				{...labelProps}/>
			
			{beforeIcon && (
				<div className="relative">
					<BeforeIconWrapper
						className={classCss`
							padding-top: calc(${props.height} / 2 - 8px);
							${(localValue && label) || (label && persistentLabel) ? tw`mt-0` : typeof label === 'undefined' ? tw`mt-0` : (labelProps?.hasBackground ? tw`mt-[24px]` : tw`mt-[20px]`)};
						`}>
						{beforeIcon()}
					</BeforeIconWrapper>
				</div>
			)}
			
			<TextFieldInput {...restProps}
			                ref={mergeRefs([ref, inputRef])}
			                hasBeforeIcon={!!beforeIcon}
			                className={`${classCss`
				                ${(localValue && label) || (label && persistentLabel) ? tw`mt-0` : typeof label === 'undefined' ? tw`mt-0` : (labelProps?.hasBackground ? tw`mt-[24px]` : tw`mt-[20px]`)}
				                ${helperText ? tw`mb-0` : typeof helperText === 'undefined' ? tw`mb-0` : (helperTextProps?.hasBackground ? tw`mb-[26px]` : tw`mb-[24px]`)}
			                `} ${clsx(className ?? '')}`}
			                onInput={(event: FormEvent<HTMLInputElement> & { target: HTMLInputElement }) => {
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

TextField.defaultProps = defaultProps
TextField.displayName = 'TextField'

export default TextField
