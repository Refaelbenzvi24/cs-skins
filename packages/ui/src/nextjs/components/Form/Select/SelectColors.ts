import theme from "../../../Utils/theme"

export interface SelectColors {
	control: {
		inputBackgroundColor: string
		inputActiveBorder: string
		inputDefaultBorder: string
		inputHoverBorder: string
	},
	dropdownIndicator: {
		dropdownIndicatorColor: string
	},
	indicatorSeparator: {
		IndicatorSeparatorColor: string
	},
	input: {
		inputTextColor: string
	},
	loadingIndicator: {
		loadingIndicatorColor: string
	},
	menu: {
		menuBackgroundColor: string
	},
	multiValue: {
		multiValueBackgroundColor: string
		multiValueTextColor: string
		multiValueRemoveHoverBackground: string
		multiValueRemoveHoverIconColor: string
	},
	placeholder: {
		placeholderTextColor: string
	},
	selectContainer: {
		inputCornersColor: string
	},
	singleValue: {
		currentValueTextColor: string
	},
	option: {
		selectedBackgroundColor: string
		activeBackgroundColor: string
		hoverBackgroundColor: string
	}
}

export const defaultColors = {
	control:            {
		inputBackgroundColor: theme.colorScheme.accent,
		inputActiveBorder:    "transparent",
		inputDefaultBorder:   "transparent",
		inputHoverBorder:     "transparent"
	},
	dropdownIndicator:  {
		dropdownIndicatorColor: theme.colorScheme.subtitle1
	},
	indicatorSeparator: {
		IndicatorSeparatorColor: theme.colorScheme.subtitle1
	},
	input:              {
		inputTextColor: theme.colorScheme.header2
	},
	loadingIndicator:   {
		loadingIndicatorColor: theme.colorScheme.subtitle1
	},
	menu:               {
		menuBackgroundColor: theme.colorScheme.accent
	},
	multiValue:         {
		multiValueBackgroundColor:       theme.colorScheme.light,
		multiValueTextColor:             theme.colorScheme.header2,
		multiValueRemoveHoverBackground: theme.colorScheme.light2,
		multiValueRemoveHoverIconColor:  theme.colorScheme.header2
	},
	option:             {
		selectedBackgroundColor: theme.colorSchemeByState.primary.default,
		activeBackgroundColor:   `${theme.colorSchemeByState.primary.default}bc`,
		hoverBackgroundColor:    `${theme.colorSchemeByState.primary.hover}a0`
	},
	placeholder:        {
		placeholderTextColor: theme.colorScheme.subtitle1
	},
	selectContainer:    {
		inputCornersColor: theme.colorScheme.accent
	},
	singleValue:        {
		currentValueTextColor: theme.colorScheme.header2
	}
} as const


export const defaultColorsDark = {
	control:            {
		inputBackgroundColor: theme.colorScheme.overlaysDark,
		inputActiveBorder:    "transparent",
		inputDefaultBorder:   "transparent",
		inputHoverBorder:     "transparent"
	},
	dropdownIndicator:  {
		dropdownIndicatorColor: theme.colorScheme.subtitle1
	},
	indicatorSeparator: {
		IndicatorSeparatorColor: theme.colorScheme.subtitle1
	},
	input:              {
		inputTextColor: theme.colorScheme.light
	},
	loadingIndicator:   {
		loadingIndicatorColor: theme.colorScheme.subtitle1
	},
	menu:               {
		menuBackgroundColor: theme.colorScheme.overlaysDark
	},
	multiValue:         {
		multiValueBackgroundColor:       theme.colorScheme.overlaysDark2,
		multiValueTextColor:             theme.colorScheme.light,
		multiValueRemoveHoverBackground: theme.colorScheme.body1,
		multiValueRemoveHoverIconColor:  theme.colorScheme.light
	},
	option:             {
		selectedBackgroundColor: theme.colorSchemeByState.overlaysDark.active,
		activeBackgroundColor:   "#3d3d52",
		hoverBackgroundColor:    theme.colorSchemeByState.overlaysDark.hover
	},
	placeholder:        {
		placeholderTextColor: theme.colorScheme.subtitle1
	},
	selectContainer:    {
		inputCornersColor: theme.colorScheme.overlaysDark
	},
	singleValue:        {
		currentValueTextColor: theme.colorScheme.accent
	}
} as const
