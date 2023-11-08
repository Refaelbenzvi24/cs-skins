"use client";
import { SelectContext, SelectContextProps } from "./SelectContext"
import { type ReactElement, useState } from "react"
import { defaultColors, defaultColorsDark, type SelectColors } from "./SelectColors"
import _ from "lodash"


interface SelectProviderOptions {
	children: ReactElement
	dark: boolean
	colors?: SelectColors
	colorsDark?: SelectColors
	props: SelectContextProps
}

const SelectProvider = (
	{
		children, dark, colors = defaultColors, colorsDark = defaultColorsDark,
		props: { textInput }
	}: SelectProviderOptions) => {
	const [colorsState, _setColorsState] = useState<SelectColors> (_.extend (defaultColors, colors))
	const [colorsDarkState, _setColorsDarkState] = useState<SelectColors> (_.extend (defaultColorsDark, colorsDark))

	return (
		<SelectContext.Provider value={{
			theme: {
				isDark:     dark,
				colors:     colorsState,
				colorsDark: colorsDarkState
			},
			props: {
				textInput
			}
		}}>
			{children}
		</SelectContext.Provider>
	)
}

export default SelectProvider
