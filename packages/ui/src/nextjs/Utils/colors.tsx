import {
	ColorByStateOptions, ColorsForState, DisabledColorOptions, SingleColorOptions, ThemeConfig, ThemeOptions,
	ZIndexOptions
} from "../components/Theme/types"
import _ from "lodash"
import { CSSProperties } from "react"
import { ThemeColor } from "./theme"

export const getSingleColorFromPath = (color: SingleColorOptions, themeConfig: ThemeConfig) => {
	const colorString = _.get(themeConfig, color as string)
	if (colorString) return colorString as CSSProperties['color']
	return color as CSSProperties['color']
}

export const getColorByStateFromPath = (color: ColorByStateOptions, themeConfig: ThemeConfig) => {
	const colorByState = _.get(themeConfig.colorSchemeByState, color as string)
	if (colorByState) return colorByState as ColorsForState
	return colorByState as ColorsForState
}

export const getDisabledColorFromPath = (color: DisabledColorOptions, themeConfig: ThemeConfig['disabledState']) => {
	const colorString = _.get(themeConfig, color as string)
	if (colorString) return colorString as CSSProperties['color']
	return color as CSSProperties['color']
}

export const getZIndexFromPath = (zIndex: ZIndexOptions, themeConfig: ThemeConfig) => {
	if (typeof zIndex === 'number') return zIndex
	return _.get(themeConfig.zIndex, zIndex)
}


export const getCssUnit = (value: number | string) => {
	if (typeof value === 'number') return `${value}px`
	return value
}
