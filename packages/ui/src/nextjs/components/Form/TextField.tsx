"use client";
import { forwardRef, useEffect, useRef, useState, type FormEvent, FC, ChangeEvent } from "react"

import { css as classCss } from "@emotion/css"
import { css, withTheme } from "@emotion/react"
import styled from "@emotion/styled"
import autoAnimate from "@formkit/auto-animate"
import clsx from "clsx"
import tw from "twin.macro"

import theme from "../../Utils/theme"
import ConditionalLabel from "./ConditionalLabel"
import HelperText, { type HelperTextProps } from "./HelperText"
import Label, { type LabelProps } from "./Label"
import { shouldForwardProp } from "../../Utils/StyledUtils";
import { mergeRefs } from "react-merge-refs"
import BeforeIconWrapper from "./BeforeIconWrapper";
import { TextFieldInput, TextFieldInputProps } from "./TextFieldInput"

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

const TextField = forwardRef<HTMLInputElement, TextFieldProps & Omit<TextFieldInputProps, "hasBeforeIcon">> ((
	{
		className,
		required,
		placeholder = undefined,
		persistentLabel = false,
		value = undefined,
		error = false,
		helperText = undefined,
		label = undefined,
		beforeIcon = undefined,
		labelProps = Label.defaultProps,
		helperTextProps = HelperText.defaultProps,
		bgColor = theme.colorScheme.accent,
		bgColorDark = theme.colorScheme.overlaysDark,
		bgColorDisabled = theme.colorSchemeByState.accent.lightDisabled,
		bgColorDisabledDark = theme.colorSchemeByState.overlaysDark.darkDisabled,
		...restProps
	},
	ref
) => {
	const { height, onInput } = restProps
	const [localValue, setLocalValue] = useState<string | readonly string[] | number> ("")

	const sectionRef = useRef<HTMLInputElement | null> (null)
	const inputRef = useRef<HTMLInputElement | null> (null)

	const requiredStar = `${required ? "*" : ""}`
	const localLabel = `${label ? `${label}${requiredStar}` : ""}`
	const localPlaceholder = `${placeholder ? `${placeholder}${requiredStar}` : (!persistentLabel ? localLabel : "") || ""}`

	useEffect (() => {
		if (sectionRef.current !== null) autoAnimate (sectionRef.current)
	}, [sectionRef])

	useEffect (() => {
		if (typeof value === "string") setLocalValue (value)
	}, [value])

	useEffect (() => {
		if (inputRef.current) setLocalValue (() => inputRef.current!.value || value || "")
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
							padding-top: calc(${height} / 2 - 8px);
							${(localValue && label) || (label && persistentLabel) ? tw`mt-0` : typeof label === "undefined" ? tw`mt-0` : (labelProps?.hasBackground ? tw`mt-[24px]` : tw`mt-[20px]`)};
						`}>
						{beforeIcon ()}
					</BeforeIconWrapper>
				</div>
			)}

			<TextFieldInput {...restProps}
			                ref={mergeRefs ([ref, inputRef])}
			                hasBeforeIcon={!!beforeIcon}
			                className={`${classCss`
				                ${(localValue && label) || (label && persistentLabel) ? tw`mt-0` : typeof label === "undefined" ? tw`mt-0` : (labelProps?.hasBackground ? tw`mt-[24px]` : tw`mt-[20px]`)}
				                ${helperText ? tw`mb-0` : typeof helperText === "undefined" ? tw`mb-0` : (helperTextProps?.hasBackground ? tw`mb-[26px]` : tw`mb-[24px]`)}
			                `} ${clsx (className ?? "")}`}
			                onInput={(event: FormEvent<HTMLInputElement> & {
				                target: HTMLInputElement
			                }) => {
				                setLocalValue (event.target.value)
				                if (onInput) onInput (event)
			                }}
			                placeholder={localPlaceholder}
			                value={localValue}/>

			{!!helperText && (
				<HelperText {...{ ...helperTextProps, error }}>
					{helperText}
				</HelperText>
			)}
		</section>
	)
})

export default withTheme(TextField)
