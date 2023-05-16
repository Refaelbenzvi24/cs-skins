import {ComponentProps, ComponentRef, forwardRef, Ref, useEffect, useId, useRef, useState} from "react"

import {css} from "@emotion/css"
import clsx from "clsx"
import {motion, type HTMLMotionProps} from "framer-motion"
import {produce} from "immer"
import Select, {defaultTheme, components, ValueContainerProps, PlaceholderProps} from "react-select"
import type {
	DropdownIndicatorProps,
	SingleValueProps,
	ControlProps,
	ContainerProps,
	MenuProps,
	Props,
	OptionProps,
	LoadingIndicatorProps,
	IndicatorSeparatorProps
} from "react-select"
import tw from "twin.macro"
import IconIonChevronDown from "~icons/ion/chevronDown"

import {useIsDark} from "../../index"
import theme from "../../Utils/theme"
import {transformTransition} from "../../Utils/transitions"
import {conditionalRotate} from "../../Utils/utils"
import HelperText, {HelperTextProps} from "./HelperText"
import Label, {LabelProps} from "./Label"
import ConditionalLabel from "./ConditionalLabel";


const IndicatorSeparator = (props: IndicatorSeparatorProps) => {
	return (
		<components.IndicatorSeparator
			{...props}
			className={css`
        background-color: ${/** IndicatorSperatorColor */ theme.colorScheme.subtitle1} !important;
        opacity: 80%;
			`}/>
	)
}

const DropdownIndicator = (props: DropdownIndicatorProps) => {
	const {isFocused} = props
	
	return (
		<components.DropdownIndicator {...props}>
			<div
				className={css`
          ${[
            theme.transitions([transformTransition('300ms')]),
            theme.transforms([
              conditionalRotate(isFocused, 180),
            ]),
          ]}
          & > * {
            color: ${/** DropdownIndicatorColor */ theme.colorScheme.subtitle1} !important;
            font-weight: ${500};
            font-size: 1rem;
            line-height: 140%;
            opacity: 80%;

            ${isFocused && css`
              opacity: 60%;
            `};
          }`}>
				<IconIonChevronDown/>
			</div>
		</components.DropdownIndicator>
	)
}

const LoadingIndicator = (props: LoadingIndicatorProps) => {
	const isDark = useIsDark()
	
	
	return (
		<components.LoadingIndicator
			{...props}
			className="!opacity-80"
			theme={produce(props.theme, (draft) => {
				draft.colors.neutral20 = theme.colorScheme.subtitle1 /** loadingIndicatorColor */
			})}/>
	)
}

const Placeholder = (props: PlaceholderProps) => {
	const {children, ...restProps} = props
	
	return (
		<components.Placeholder
			{...props}
			className={css`
        color: ${/** placeholderTextColor */ theme.colorScheme.subtitle1} !important;
			`}>
			{children}
		</components.Placeholder>
	)
}

const SingleValue = (props: SingleValueProps) => {
	const {children, ...restProps} = props
	const isDark = useIsDark()
	
	return (
		<components.SingleValue {...restProps}
		                        className={css`
                              color: ${/** currentValueTextColor */ theme.colorScheme.header2} !important;
                              font-weight: ${500};
                              font-size: 1rem;
                              line-height: 140%;

                              ${isDark && css`
                                color: ${/** currentValueTextColor */ theme.colorScheme.accent} !important;
                              `
                              }
		                        `}>
			{children}
		</components.SingleValue>
	)
}

const ValueContainer = (props: ValueContainerProps) => {
	const {children, ...restProps} = props
	
	return (
		<components.ValueContainer
			className={css`
        ${tw`px-[22px]`};
			`}
			{...restProps}>
			{children}
		</components.ValueContainer>
	)
}

const Control = (props: ControlProps) => {
	const {children, isFocused, ...restProps} = props
	const isDark = useIsDark()
	
	
	return (
		<components.Control {...{...restProps, isFocused}}
		                    className={css`
                          ${tw`!cursor-pointer`}
                          background-color: ${/** inputBgColor */ theme.colorScheme.accent} !important;
                          transition-property: none !important;

                          ${isDark && css`
                            background-color: ${/** inputBgColor */ theme.colorScheme.overlaysDark} !important;
                          `}
		                    `}
		                    theme={produce(props.theme, (draft) => {
			                    draft.borderRadius = 5
			                    /** inputActiveBorder */
			                    draft.colors.primary = 'transparent'
			                    /** inputDefaultBorder */
			                    draft.colors.neutral20 = 'transparent'
			                    /** inputHoverBorder */
			                    draft.colors.neutral30 = 'transparent'
			                    
			                    if (isDark) {
				                    /** inputActiveBorder */
				                    draft.colors.primary = 'transparent'
				                    /** inputDefaultBorder */
				                    draft.colors.neutral20 = 'transparent'
				                    /** inputHoverBorder */
				                    draft.colors.neutral30 = 'transparent'
			                    }
		                    })}>
			{children}
		</components.Control>
	)
}

const SelectContainer = (props: ContainerProps) => {
	const {children, ...restProps} = props
	const {isFocused} = restProps
	const isDark = useIsDark()
	
	return (
		<components.SelectContainer {...restProps}
		                            className={css`
                                  background-color: ${/** inputCornersColor */ theme.colorScheme.accent} !important;
                                  box-shadow: ${theme.shadows["2"]};

                                  ${isFocused && css`
                                    box-shadow: ${theme.shadows["3"]};
                                  `};

                                  ${isDark && css`
                                    background-color: ${/** inputCornersColor */ theme.colorScheme.overlaysDark} !important;
                                  `}
		                            `}>
			{children}
		</components.SelectContainer>
	)
}

const Option = (props: OptionProps) => {
	// const isDark = useIsDark()
	
	
	return (
		<components.Option
			className={css`${tw`!cursor-pointer`}`}
			{...props}
			theme={produce(props.theme, (draft) => {
				// draft.colors.primary = theme.colorScheme.accent /** optionsColor */
				//
				// if (isDark) {
				// 	draft.colors.primary = theme.colorSchemeByState.overlaysDark.active /** optionsColor */
				// }
			})}>
			{props.children}
		</components.Option>
	)
}

const Menu = (props: MenuProps) => {
	const {children, ...restProps} = props
	const isDark = useIsDark()
	
	return (
		<components.Menu {...restProps}
		                 className={css`
                       background-color: ${/** menuBgColor */theme.colorScheme.accent} !important;

                       ${isDark && css`
                         background-color: ${/** menuBgColor */ theme.colorScheme.overlaysDark} !important;
                       `}
		                 `}>
			{children}
		</components.Menu>
	)
}

interface SelectOption {
	label: string
	value: string
}

interface SelectProps extends Omit<Props, 'isRtl' | 'onChange'> {
	label?: string
	persistentLabel?: boolean
	dir?: "rtl" | "ltr"
	dark?: boolean
	options: SelectOption[] | readonly SelectOption[]
	error?: boolean
	value?: SelectOption
	defaultValue?: SelectOption
	onBlur?: () => void
	onChange?: (value: SelectOption) => void
	helperText?: string
	wrapperProps?: HTMLMotionProps<"div">
	labelProps?: LabelProps
	helperTextProps?: HelperTextProps
}

const defaultProps = {
	label: undefined,
	persistentLabel: false,
	dir: undefined,
	dark: undefined,
	error: false,
	helperText: undefined,
	wrapperProps: {},
	labelProps: Label.defaultProps,
	helperTextProps: HelperText.defaultProps
} as const

// TODO: create global context for the component and store all the colors there, then use them in each component
// TODO: Add focus indicator
const SelectWithLabel = forwardRef<ComponentRef<typeof Select>, SelectProps>((props, ref) => {
	const {
		label,
		dir,
		className,
		placeholder,
		wrapperProps,
		persistentLabel,
		onFocus,
		dark,
		onBlur,
		onChange,
		error,
		value,
		helperText,
		labelProps,
		helperTextProps,
		...restProps
	} = props
	const [isFocused, setIsFocused] = useState(false)
	const [localValue, setLocalValue] = useState<SelectOption | undefined>(value || props.defaultValue)
	
	const wasFocused = useRef(false)
	const firstUpdate = useRef(true)
	const sectionRef = useRef(null)
	
	const isDark = useIsDark()
	
	
	useEffect(() => {
		const blurController = () => {
			if (!firstUpdate.current && wasFocused.current && !isFocused && onBlur) {
				onBlur()
			}
			if (!firstUpdate.current) {
				wasFocused.current = true
			}
			firstUpdate.current = false
		}
		
		blurController()
	}, [isFocused, onBlur])
	
	return (
		<section ref={sectionRef}>
			<ConditionalLabel
				condition={persistentLabel ? true : !!localValue}
				{...{...labelProps, label}}/>
			<motion.div
				{...wrapperProps}
				className={`${css`
          ${(!!label && (!!localValue || persistentLabel)) ? tw`mt-0` : tw`mt-6`}
          ${!!helperText ? tw`mb-0` : tw`mb-6`}
				`} ${clsx(className)}`}>
				<Select blurInputOnSelect
				        isSearchable={false}
				        placeholder={placeholder || label}
				        instanceId={useId()}
				        {...restProps}
				        ref={ref}
				        onFocus={(event) => {
					        setIsFocused(true)
					        if (onFocus) {
						        onFocus(event)
					        }
				        }}
				        onBlur={() => {
					        setIsFocused(false)
				        }}
				        onChange={(value) => {
					        if (onChange) onChange(value as SelectOption)
					        setLocalValue(value as SelectOption)
				        }}
				        value={localValue}
				        isRtl={dir === "rtl"}
				        theme={produce(defaultTheme, (draft) => {
					        draft.colors.primary = theme.colorSchemeByState.primary.default
					        draft.colors.primary50 = `${theme.colorSchemeByState.primary.default}bc`
					        draft.colors.primary25 = `${theme.colorSchemeByState.primary.hover}a0`
					        
					        if (isDark) {
						        draft.colors.primary = theme.colorSchemeByState.overlaysDark.active
						        draft.colors.primary50 = '#3d3d52'
						        draft.colors.primary25 = theme.colorSchemeByState.overlaysDark.hover
					        }
				        })}
				        components={{
					        DropdownIndicator,
					        Option,
					        Placeholder,
					        Control,
					        SingleValue,
					        ValueContainer,
					        SelectContainer,
					        LoadingIndicator,
					        IndicatorSeparator,
					        Menu,
				        }}/>
			</motion.div>
			{!!helperText && (
				<HelperText {...{...helperTextProps, error}}>
					{helperText}
				</HelperText>
			)}
		</section>
	)
})

SelectWithLabel.defaultProps = defaultProps
SelectWithLabel.displayName = 'Select'

export default SelectWithLabel
