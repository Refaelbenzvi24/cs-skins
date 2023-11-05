import { theme } from "../../../index"
import { StylesConfig } from 'react-select';
import { SelectContextType } from "./SelectContext"


const selectStyles = (isDark: boolean, selectTheme: SelectContextType['theme']): StylesConfig => ({
	control:            (styles) => ({
		...styles,
		backgroundColor:    isDark ? selectTheme.colorsDark.control.inputBackgroundColor : selectTheme.colors.control.inputBackgroundColor,
		transitionProperty: "none",
		minHeight:          "inherit",

	}),
	container:          (styles, { isFocused }) => ({
		...styles,
		backgroundColor: isDark ? selectTheme.colorsDark.selectContainer.inputCornersColor : selectTheme.colors.selectContainer.inputCornersColor,
		boxShadow:       isFocused ? theme.shadows["3"] : theme.shadows["2"],
		minHeight:       'inherit'
	}),
	input:              (styles) => ({
		...styles,
		color:      isDark ? selectTheme.colorsDark.input.inputTextColor : selectTheme.colors.input.inputTextColor,
		fontWeight: 500,
		fontSize:   "1rem",
		lineHeight: "140%"
	}),
	indicatorSeparator: (styles) => ({
		...styles,
		opacity:         "80%",
		backgroundColor: isDark ? selectTheme.colorsDark.indicatorSeparator.IndicatorSeparatorColor : selectTheme.colors.indicatorSeparator.IndicatorSeparatorColor
	}),
	menu:               (styles) => ({
		...styles,
		backgroundColor: isDark ? selectTheme.colorsDark.menu.menuBackgroundColor : selectTheme.colors.menu.menuBackgroundColor,
	}),
	placeholder:        (styles) => ({
		...styles,
		color: isDark ? selectTheme.colorsDark.placeholder.placeholderTextColor : selectTheme.colors.placeholder.placeholderTextColor
	}),
	singleValue:        (styles) => ({
		...styles,
		color:      isDark ? selectTheme.colorsDark.singleValue.currentValueTextColor : selectTheme.colors.singleValue.currentValueTextColor,
		fontWeight: 500,
		fontSize:   '1rem',
		lineHeight: '140%'
	}),
	valueContainer:    (styles) => ({
		...styles,
		padding: "0 22px"
	}),
})

export default selectStyles
