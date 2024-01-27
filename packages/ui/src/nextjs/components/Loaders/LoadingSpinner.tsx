"use client";
import styled from "@emotion/styled";
import { css, withTheme } from "@emotion/react";
import { getSingleColorFromPath } from "../../Utils/colors"
import { SingleColorOptions } from "../Theme/types"
import { StyledProps } from "../../types"

interface LengthObject {
	value: number;
	unit: string;
}

const cssUnit: { [unit: string]: boolean } = {
	cm: true,
	mm: true,
	in: true,
	px: true,
	pt: true,
	pc: true,
	em: true,
	ex: true,
	ch: true,
	rem: true,
	vw: true,
	vh: true,
	vmin: true,
	vmax: true,
	"%": true,
};

export function parseLengthAndUnit(size: number | string): LengthObject {
	if (typeof size === "number") {
		return {
			value: size,
			unit: "px",
		};
	}
	let value: number;
	const valueString: string = (size.match(/^[0-9.]*/) || "").toString();
	if (valueString.includes(".")) {
		value = parseFloat(valueString);
	} else {
		value = parseInt(valueString, 10);
	}

	const unit: string = (size.match(/[^0-9]*$/) || "").toString();

	if (cssUnit[unit]) {
		return {
			value,
			unit,
		};
	}

	console.warn(`React Spinners: ${size} is not a valid css value. Defaulting to ${value}px.`);

	return {
		value,
		unit: "px",
	};
}

export function cssValue(value: number | string): string {
	const lengthWithunit = parseLengthAndUnit(value);

	return `${lengthWithunit.value}${lengthWithunit.unit}`;
}

export interface StyledLoadingSpinnerProps extends StyledProps {
	color: SingleColorOptions;
	colorDark: SingleColorOptions;
	speedMultiplier: number
	thickness: number;
	size: number | string;
	dark?: boolean;
}

const createAnimation = (loaderName: string, frames: string, suffix: string): string => {
	const animationName = `react-spinners-${loaderName}-${suffix}`;

	if (typeof window == "undefined" || !window.document) {
		return animationName;
	}

	const styleEl = document.createElement("style");
	document.head.appendChild(styleEl);
	const styleSheet = styleEl.sheet;

	const keyFrames = `
    @keyframes ${animationName} {
      ${frames}
    }
  `;

	if (styleSheet) {
		styleSheet.insertRule(keyFrames, 0);
	}

	return animationName;
};

const clip = createAnimation(
	"ClipLoader",
	"0% {transform: rotate(0deg) scale(1)} 50% {transform: rotate(180deg) scale(0.8)} 100% {transform: rotate(360deg) scale(1)}",
	"clip"
);

const StyledLoadingSpinner = styled.span((props: StyledLoadingSpinnerProps) => {
	const resolvedColor = getSingleColorFromPath(props.color, props.theme.config)
	const resolvedColorDark = getSingleColorFromPath(props.colorDark, props.theme.config)
	return [
		css`
			background: transparent !important;
			width: ${cssValue(props.size)};
			height: ${cssValue(props.size)};
			border-radius: 100%;
			border: ${props.thickness}px solid;
			border-top-color: ${resolvedColor};
			border-bottom-color: transparent;
			border-left-color: ${resolvedColor};
			border-right-color: ${resolvedColor};
			display: inline-block;
			animation: ${clip} ${0.75 / props.speedMultiplier}s 0s infinite linear;
			animation-fill-mode: both;
		`,
		(props) => ((props.dark || props.theme.isDark)) && css`
			border-top-color: ${resolvedColorDark};
			border-left-color: ${resolvedColorDark};
			border-right-color: ${resolvedColorDark};
		`
	]
})

const LoadingSpinner = ({
	color = "colorScheme.subtitle1",
	colorDark = "colorScheme.subtitle1",
	speedMultiplier = 0.7,
	thickness = 4,
	size = 85,
	...props
}: StyledLoadingSpinnerProps) => {
	return (
		<StyledLoadingSpinner
			{...{color, colorDark, speedMultiplier, size, thickness}}
			{...props}/>
	)
}

export default withTheme(LoadingSpinner)
