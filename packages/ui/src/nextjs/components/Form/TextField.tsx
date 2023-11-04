"use client";
import { forwardRef, useEffect, useRef, useState, type FormEvent } from "react"

import { css as classCss } from "@emotion/css"
import { withTheme } from "@emotion/react"
import clsx from "clsx"
import tw from "twin.macro"

import ConditionalLabel from "./ConditionalLabel"
import HelperText, { type HelperTextProps } from "./HelperText"
import Label, { type LabelProps } from "./Label"
import { mergeRefs } from "react-merge-refs"
import BeforeIconWrapper from "./BeforeIconWrapper";
import { TextFieldInput, TextFieldInputProps } from "./TextFieldInput"
import ConditionalHelperText from "./ConditionalHelperText"
import { HTMLMotionProps } from "framer-motion"


interface TextFieldProps extends HTMLMotionProps<"input"> {
	placeholder?: string
	persistentLabel?: boolean
	centered?: boolean
	value?: string | readonly string[] | number | undefined
	initialValue?: string | readonly string[] | number | undefined
	error?: boolean
	helperText?: string
	label?: string
	hideHelperText?: boolean
	labelProps?: LabelProps
	beforeIcon?: React.ReactNode
	helperTextProps?: HelperTextProps
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps & Omit<TextFieldInputProps, "hasBeforeIcon">>((
	{
		className,
		required,
		placeholder = undefined,
		persistentLabel = false,
		hideHelperText = false,
		value = undefined,
		initialValue,
		error = false,
		helperText = undefined,
		label = undefined,
		beforeIcon = undefined,
		labelProps = Label.defaultProps,
		helperTextProps = HelperText.defaultProps,
		...restProps
	},
	ref
) => {
	const { height, onInput }         = restProps
	const [localValue, setLocalValue] = useState<string | readonly string[] | number>(initialValue ?? value ?? "")

	const inputRef = useRef<HTMLInputElement | null>(null)

	const requiredStar     = required ? "*" : ""
	const localLabel       = label ? `${label}${requiredStar}` : ""
	const localPlaceholder = placeholder ? `${placeholder}${requiredStar}` : (!persistentLabel ? localLabel : "")

	useEffect(() => {
		if(typeof value === "string") setLocalValue(value)
	}, [value])

	useEffect(() => {
		if(inputRef.current) setLocalValue(() => inputRef.current!.value || value || "")
	}, [inputRef.current?.value])
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
					<BeforeIconWrapper height={height}>
						{beforeIcon}
					</BeforeIconWrapper>
				</div>
			)}

			<TextFieldInput {...restProps}
			                ref={mergeRefs([ref, inputRef])}
			                hasBeforeIcon={!!beforeIcon}
			                className={`transition-all delay-[1500ms] ${clsx(className ?? "")}`}
			                onInput={(event: FormEvent<HTMLInputElement> & {
				                target: HTMLInputElement
			                }) => {
				                setLocalValue(event.target.value)
				                if(onInput) onInput(event)
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

export default withTheme(TextField)
