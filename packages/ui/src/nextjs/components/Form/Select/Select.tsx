import {
	type ComponentProps, type ComponentRef, forwardRef, type KeyboardEventHandler, useEffect, useId, useRef, useState
} from "react"

import { css } from "@emotion/css"
import clsx from "clsx"
import { motion, type HTMLMotionProps } from "framer-motion"
import Select from "react-select"
import makeAnimated from "react-select/animated"
import type { Props } from "react-select"
import CreatableSelect from "react-select/creatable"
import tw from "twin.macro"
import * as components from "./"

import { useIsDark } from "../../../index"
import useToasts from "../../../hooks/useToasts"
import HelperText, { type HelperTextProps } from "../HelperText"
import Label, { type LabelProps } from "../Label"
import ConditionalLabel from "../ConditionalLabel";
import SelectProvider from "./SelectProvider"
import { type SelectColors } from "./SelectColors"

interface SelectOption {
	label: string
	value: string
}

interface SelectProps extends Omit<Props, "isRtl" | "onChange"> {
	removeAnimations?: boolean
	creatable?: boolean
	label?: string
	persistentLabel?: boolean
	minContainerHeight?: string
	dir?: "rtl" | "ltr"
	dark?: boolean
	colors?: SelectColors
	colorsDark?: SelectColors
	options?: SelectOption[] | readonly SelectOption[]
	error?: boolean
	textInput?: boolean
	value?: SelectOption | SelectOption[]
	defaultValue?: SelectOption
	onBlur?: () => void
	onChange?: (value: SelectOption | SelectOption[]) => void
	helperText?: string
	wrapperProps?: HTMLMotionProps<"div">
	labelProps?: LabelProps
	helperTextProps?: HelperTextProps
}

const defaultProps = {
	label:           undefined,
	persistentLabel: false,
	dir:             undefined,
	dark:            undefined,
	error:           false,
	helperText:      undefined,
	wrapperProps:    {},
	labelProps:      Label.defaultProps,
	helperTextProps: HelperText.defaultProps
} as const

const customComponents: ComponentProps<typeof Select>["components"] = {
	DropdownIndicator:  components.DropdownIndicator,
	Option:             components.Option,
	Placeholder:        components.Placeholder,
	Control:            components.Control,
	SingleValue:        components.SingleValue,
	ValueContainer:     components.ValueContainer,
	SelectContainer:    components.SelectContainer,
	LoadingIndicator:   components.LoadingIndicator,
	IndicatorSeparator: components.IndicatorSeparator,
	Menu:               components.Menu,
	MultiValue:         components.MultiValue,
	MultiValueRemove:   components.MultiValueRemove,
	Input:              components.Input
}

const animatedComponents = makeAnimated ({
	...(customComponents as Parameters<typeof makeAnimated>["0"]),
})

// TODO: Add focus indicator
const SelectWithLabel = forwardRef<ComponentRef<typeof Select>, SelectProps> ((props, ref) => {
	const {
		removeAnimations,
		label,
		dark,
		colors,
		colorsDark,
		dir,
		className,
		placeholder,
		wrapperProps,
		persistentLabel,
		onFocus,
		minContainerHeight,
		creatable = false,
		textInput,
		onBlur,
		onChange,
		onInputChange,
		error,
		value,
		inputValue,
		helperText,
		labelProps,
		helperTextProps,
		...restProps
	} = props
	const Component = creatable ? CreatableSelect : Select

	const initialValue = props.isMulti ? (value instanceof Array ? value : []) : value || props.defaultValue

	const [isFocused, setIsFocused] = useState (false)
	const [localValue, setLocalValue] = useState<SelectOption | SelectOption[] | undefined> (initialValue)
	const [localInputValue, setLocalInputValue] = useState<string> ("")

	const wasFocused = useRef (false)
	const firstUpdate = useRef (true)
	const sectionRef = useRef (null)

	const { generalError } = useToasts ()
	const isAppDark = useIsDark ()
	const isDark = dark ?? isAppDark

	const createOption = (label: string) => ({
		label,
		value: label,
	});

	const handleKeyDown: KeyboardEventHandler = (event) => {
		if (!localInputValue) return;
		if (!(localValue instanceof Array)) return;
		switch (event.key) {
			case "Enter":
			case "Tab": {
				try {
					const isLocalInputValueAnArray = localInputValue.startsWith ("[") && localInputValue.endsWith ("]")
					if (!isLocalInputValueAnArray) {
						return setLocalValue ((prev) => {
							const newState = [...(prev as SelectOption[]), createOption (localInputValue)]
							if (onChange) onChange (newState)
							return newState
						})
					}
					const options = JSON.parse (localInputValue) as string[]
					const newOptions = options.map (createOption)
					setLocalValue ((prev) => {
						const newState = [...(prev as SelectOption[]), ...newOptions]
						if (onChange) onChange (newState)
						return newState
					})
				} catch (error) {
					void generalError ("errors.invalidJSON")
				} finally {
					setLocalInputValue ("")
					event.preventDefault ()
				}
			}
		}
	};

	useEffect (() => {
		const blurController = () => {
			if (!firstUpdate.current && wasFocused.current && !isFocused && onBlur) {
				onBlur ()
			}
			if (!firstUpdate.current) {
				wasFocused.current = true
			}
			firstUpdate.current = false
		}

		blurController ()
	}, [isFocused, onBlur])

	useEffect (() => {
		if (value && value !== localValue) {
			setLocalValue (value)
		}
	}, [value])

	useEffect (() => {
		if (inputValue && inputValue !== localInputValue) {
			setLocalInputValue (inputValue)
		}
	}, [inputValue]);

	return (
		<section ref={sectionRef}>
			<ConditionalLabel
				condition={persistentLabel ? true : !!localValue}
				{...{ ...labelProps, label }}/>
			<motion.div
				{...wrapperProps}
				className={`${css`
                  ${(!!label && (!!localValue || persistentLabel)) ? tw`mt-0` : tw`mt-6`}
                  min-height: ${minContainerHeight || props.isMulti ? "50px" : "38px"};
                  ${!!helperText ? tw`mb-0` : tw`mb-6`}
				`} ${clsx (className)}`}>
				<SelectProvider colors={colors} colorsDark={colorsDark} dark={isDark}>
					<Component blurInputOnSelect
					           isSearchable={creatable}
					           placeholder={placeholder || label}
					           instanceId={useId ()}
					           {...restProps}
					           menuIsOpen={textInput ? false : restProps.menuIsOpen}
					           ref={ref}
					           onFocus={(event) => {
						           setIsFocused (true)
						           if (onFocus) {
							           onFocus (event)
						           }
					           }}
					           onBlur={() => {
						           setIsFocused (false)
					           }}
					           onInputChange={(value, actionMeta) => {
						           if (props.isMulti) setLocalInputValue (value)
						           if (onInputChange) onInputChange (value, actionMeta)
					           }}
					           onChange={(value) => {
						           if (onChange) onChange (value as SelectOption)
						           setLocalValue (value as SelectOption | SelectOption[])
					           }}
					           onKeyDown={(event) => {
						           if (props.isMulti) handleKeyDown (event)
						           if (restProps.onKeyDown) restProps.onKeyDown (event)
					           }}
					           value={localValue}
					           inputValue={localInputValue}
					           isRtl={dir === "rtl"}
					           components={{
						           ...(removeAnimations ? customComponents : animatedComponents),
						           ...(textInput ? { DropdownIndicator: null } : {})
					           }}/>
				</SelectProvider>
			</motion.div>
			{!!helperText && (
				<HelperText {...{ ...helperTextProps, error }}>
					{helperText}
				</HelperText>
			)}
		</section>
	)
})

SelectWithLabel.defaultProps = defaultProps
SelectWithLabel.displayName = "Select"

export default SelectWithLabel
