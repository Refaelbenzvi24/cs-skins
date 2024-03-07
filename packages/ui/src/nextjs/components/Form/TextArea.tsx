"use client";
import { type FormEvent, forwardRef, useEffect, useRef, useState } from "react"

import { css as classCss } from "@emotion/css"
import { withTheme } from "@emotion/react"
import clsx from "clsx"
import tw from "twin.macro"
import { mergeRefs } from "react-merge-refs"

import theme from "../../utils/theme"
import ConditionalLabel from "./ConditionalLabel"
import HelperText, { type HelperTextProps } from "./HelperText"
import Label, { type LabelProps } from "./Label";
import { shouldForwardProp } from "../../utils/StyledUtils";
import BeforeIconWrapper from "./BeforeIconWrapper";
import { TextAreaInput, TextAreaInputProps } from "./TextAreaInput"
import ConditionalHelperText from "./ConditionalHelperText"




interface TextAreaProps extends React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
	persistentLabel?: boolean
	value?: string | readonly string[] | number | undefined
	error?: boolean
	helperText?: string
	label?: string
	hideHelperText?: boolean
	labelProps?: LabelProps
	beforeIcon?: () => React.ReactNode
	helperTextProps?: HelperTextProps
}


const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps & TextAreaInputProps> ((
	{
		placeholder = undefined,
		centered = false,
		persistentLabel = false,
		hideHelperText = false,
		value = undefined,
		error = false,
		dark = undefined,
		minHeight = "150px",
		beforeIcon = undefined,
		helperText = undefined,
		label = undefined,
		labelProps = Label.defaultProps,
		helperTextProps = HelperText.defaultProps,
		className,
		onInput,
		required,
		...restProps
	},
	ref
) => {
	const [localValue, setLocalValue] = useState<string | readonly string[] | number> ("")

	const textareaRef = useRef<HTMLTextAreaElement | null> (null)

	const requiredStar = `${required ? "*" : ""}`
	const localLabel = `${label ? `${label}${requiredStar}` : ""}`
	const localPlaceholder = `${placeholder ? `${placeholder}${requiredStar}` : (!persistentLabel ? localLabel : "") || ""}`

	const handleAutoGrow = () => {
		if (textareaRef?.current && textareaRef.current instanceof HTMLTextAreaElement) {
			textareaRef.current.style.height = "0px"
			const scrollHeight = textareaRef.current.scrollHeight + 5
			textareaRef.current.style.height = `${scrollHeight}px`
		}
	}

	useEffect (() => {
		handleAutoGrow ()
	}, [localValue])

	useEffect (() => {
		if (typeof value === "string") setLocalValue (value)
	}, [value])

	useEffect (() => {
		if (textareaRef.current) setLocalValue (() => textareaRef.current!.value || value || "")
	}, [textareaRef.current?.value])

	return (
		<section className="flex flex-col">
			{localLabel && (
				<ConditionalLabel
					condition={persistentLabel ? true : !!localValue}
					{...labelProps}>
					{localLabel}
				</ConditionalLabel>
			)}

			{beforeIcon && (
				<div className="relative">
					<BeforeIconWrapper
						className={classCss`
							${tw`pt-[7px]`};
							${(localValue && label) || (label && persistentLabel) ? tw`mt-0` : typeof label === "undefined" ? tw`mt-0` : (labelProps?.hasBackground ? tw`mt-[24px]` : tw`mt-[20px]`)};
						`}>
						{beforeIcon ()}
					</BeforeIconWrapper>
				</div>
			)}

			<TextAreaInput {...restProps}
			               ref={mergeRefs ([textareaRef, ref])}
			               hasBeforeIcon={!!beforeIcon}
			               minHeight={minHeight}
			               className={`${clsx (className ?? "")}`}
			               onInput={(event: FormEvent<HTMLTextAreaElement> & { target: HTMLInputElement }) => {
				               setLocalValue (event.target.value)
				               if (onInput) onInput (event)
			               }}
			               placeholder={localPlaceholder}
			               value={localValue}/>

			{!hideHelperText && (
				<ConditionalHelperText condition={!!helperText} {...{ ...helperTextProps, error }}>
					{helperText}
				</ConditionalHelperText>
			)}
		</section>
	)
})


export default withTheme(TextArea)
