"use client";
import {
	type ComponentProps, type ComponentRef, forwardRef, type KeyboardEventHandler, useContext, useEffect, useId, useRef,
	useState
} from "react"


import clsx from "clsx"
import { type HTMLMotionProps } from "framer-motion"
import Select from "react-select"
import makeAnimated from "react-select/animated"
import type { Props } from "react-select"
import CreatableSelect from "react-select/creatable"
import * as components from "./"
import { ThemeContext } from "@emotion/react"
import { useIsDark } from "../../../index"
import useToasts from "../../../hooks/useToasts"
import { type HelperTextProps } from "../HelperText"
import { type LabelProps } from "../Label"
import ConditionalLabel from "../ConditionalLabel";
import SelectProvider from "./SelectProvider"
import { type SelectColors } from "./SelectColors"
import ConditionalHelperText from "../ConditionalHelperText"
import { selectStyles, useSelect } from "./"
import SelectWrapper from "./SelectWrapper"
import { css } from "@emotion/css"


export interface SelectOption {
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
	menuIsOpen?: boolean
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

const customComponents: ComponentProps<typeof Select>["components"] = {
	DropdownIndicator: components.DropdownIndicator,
	Option:            components.Option,
	Control:           components.Control,
	MultiValue:        components.MultiValue,
	MultiValueRemove:  components.MultiValueRemove
}

const animatedComponents = makeAnimated ({
	...(customComponents as Parameters<typeof makeAnimated>["0"]),
})

// TODO: Add focus indicator
const SelectWithLabel = forwardRef<ComponentRef<typeof Select>, SelectProps> ((
	{
		removeAnimations,
		label,
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
		error,
		value,
		helperText,
		labelProps,
		helperTextProps,
		...restProps
	}, ref) => {
	const { theme: selectTheme } = useSelect ()
	const Component = creatable ? CreatableSelect : Select

	const initialValue = restProps.isMulti ? (value instanceof Array ? value : []) : value || restProps.defaultValue

	const [isFocused, setIsFocused] = useState (false)
	const [localValue, setLocalValue] = useState<SelectOption | SelectOption[] | undefined> (initialValue)
	const [localInputValue, setLocalInputValue] = useState<string> ("")
	const emotionTheme = useContext (ThemeContext)

	const wasFocused = useRef (false)
	const firstUpdate = useRef (true)
	const sectionRef = useRef (null)

	const { generalError } = useToasts ()

	const isAppDark = useIsDark ()
	const isDark = restProps.dark ?? isAppDark

	const createOption = (label: string) => ({ label, value: label });

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

	return (
		<section ref={sectionRef}>
			<ConditionalLabel
				condition={persistentLabel ? true : !!localValue}
				{...labelProps}>
				{label}
			</ConditionalLabel>
			<SelectWrapper {...wrapperProps}
			               label={label}
			               value={localValue}
			               persistentLabel={persistentLabel}
			               minContainerHeight={minContainerHeight}
			               isMulti={restProps.isMulti}
			               helperText={helperText}
			               className={clsx (className)}>
				<Component blurInputOnSelect
				           classNames={{
					           control: () => css`
                                 cursor: ${textInput ? "text" : "pointer"};
					           `,
					           clearIndicator: () => css`
                                 cursor: pointer;
					           `,
				           }}
				           isSearchable={creatable}
				           placeholder={placeholder || label}
				           instanceId={useId ()}
				           {...restProps}
				           menuIsOpen={textInput ? (restProps.menuIsOpen ?? false) : restProps.menuIsOpen}
				           theme={(theme) => ({
					           ...theme,
					           ...emotionTheme
				           })}
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
					           if (restProps.isMulti) setLocalInputValue (value)
					           if (restProps.onInputChange) restProps.onInputChange (value, actionMeta)
				           }}
				           onChange={(value) => {
					           if (onChange) onChange (value as SelectOption)
					           setLocalValue (value as SelectOption | SelectOption[])
				           }}
				           onKeyDown={(event) => {
					           if (restProps.isMulti) handleKeyDown (event)
					           if (restProps.onKeyDown) restProps.onKeyDown (event)
				           }}
				           value={localValue}
				           inputValue={localInputValue}
				           isRtl={dir === "rtl"}
				           styles={selectStyles (isDark, selectTheme)}
				           components={{
					           ...(removeAnimations ? customComponents : animatedComponents),
					           ...(textInput ? { DropdownIndicator: null } : {})
				           }}/>
			</SelectWrapper>
			<ConditionalHelperText condition={!!helperText} {...{ ...helperTextProps, error }}>
				{helperText}
			</ConditionalHelperText>
		</section>
	)
})

const SelectWithProvider = forwardRef<ComponentRef<typeof Select>, SelectProps> ((props, ref) => {
	const { colors, colorsDark, dark } = props
	const isAppDark = useIsDark ()
	const isDark = dark ?? isAppDark
	return (
		<SelectProvider colors={colors}
		                colorsDark={colorsDark}
		                dark={isDark}
		                props={{
			                textInput: props.textInput
		                }}>
			<SelectWithLabel ref={ref} {...props}/>
		</SelectProvider>
	)
})

export default SelectWithProvider
