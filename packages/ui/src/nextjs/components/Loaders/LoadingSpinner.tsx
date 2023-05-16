import styled from "@emotion/styled";
import {css} from "@emotion/react";

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

export interface StyledLoadingSpinnerProps {
	color: string;
	loading: boolean;
	speedMultiplier: number;
	size: number | string;
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

const StyledLoadingSpinner = styled.span((props: StyledLoadingSpinnerProps) => [
	css`
    background: transparent !important;
    width: ${cssValue(props.size)};
    height: ${cssValue(props.size)};
    borderRadius: 100%;
    border: 2px solid;
    borderTopColor: ${props.color};
    borderBottomColor: "transparent";
    borderLeftColor: ${props.color};
    borderRightColor: ${props.color};
    display: inline-block;
    animation: \`${clip} ${0.75 / props.speedMultiplier}s 0s infinite linear\`;
    animationFillMode: "both";
	`
])

const defaultProps = {
	loading: true,
	color: "#000000",
	speedMultiplier: 1,
	size: 35
} as const

const LoadingSpinner = (props: StyledLoadingSpinnerProps & typeof defaultProps) => {
	const {loading} = props
	
	if (!loading) return null
	
	return (
		<StyledLoadingSpinner {...props}/>
	)
}

LoadingSpinner.defaultProps = defaultProps
