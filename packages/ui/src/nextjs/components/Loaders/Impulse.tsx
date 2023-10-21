"use client";
import React from "react";
import styled from "@emotion/styled";
import {css, keyframes} from "@emotion/react";

interface ImpulseProps {
	backColor: string
	frontColor: string
}

const impulse = (props: ImpulseProps) => keyframes`
  0% {
    background: ${props.backColor};
    transform: scale(1);
    animation-timing-function: cubic-bezier(1, 0, 0.7, 1);
  }
  40% {
    background: ${props.frontColor};
    transform: scale(1.5);
    animation-timing-function: cubic-bezier(0.3, 0, 0, 1);
  }
  72.5% {
    background: ${props.backColor};
    transform: scale(1);
    animation-timing-function: linear;
  }
  100% {
    background: ${props.backColor};
    transform: scale(1);
  }
`

interface GetBallsProps extends ImpulseProps {
	countBalls: number
	size: number
	sizeUnit: string
}

const getBalls = ({countBalls, frontColor, backColor, size, sizeUnit}: GetBallsProps) => {
	const balls = [];
	for (let i = 0; i < countBalls; i++) {
		balls.push(
			<Ball
				frontColor={frontColor}
				backColor={backColor}
				size={size}
				x={i * (size / 5 + size / 5)}
				y={0}
				key={i.toString()}
				index={i}
				sizeUnit={sizeUnit}
			/>,
		);
	}
	return balls;
};

interface WrapperProps {
	size: number
	sizeUnit: string
}

const Wrapper = styled.div((props: WrapperProps) => [
	css`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${`${props.size}${props.sizeUnit}`};
    height: ${`${props.size / 5}${props.sizeUnit}`};
	`
])

interface BallProps extends ImpulseProps, WrapperProps {
	x: number
	y: number
	index: number
}

const Ball = styled.div((props: BallProps) => [
	css`
    position: absolute;
    top: ${`${props.y}${props.sizeUnit}`};
    left: ${`${props.x}${props.sizeUnit}`};
    width: ${`${props.size / 5}${props.sizeUnit}`};
    height: ${`${props.size / 5}${props.sizeUnit}`};
    border-radius: 50%;
    background-color: ${props.frontColor};
    animation: ${impulse({frontColor: props.frontColor, backColor: props.frontColor})} 1.25s linear infinite;
    animation-delay: ${props.index * 0.125}s;
	`
])


interface ImpulseSpinnerProps extends Partial<WrapperProps>, Partial<ImpulseProps> {
	loading?: boolean
}

const defaultProps = {
	loading: true,
	size: 40,
	frontColor: "#00ff89",
	backColor: "#4b4c56",
	sizeUnit: "px"
}


export const ImpulseSpinner = ({size, frontColor, backColor, loading, sizeUnit}: typeof defaultProps & ImpulseSpinnerProps) => {
	const countBalls = 3;
	return (
		loading ? (
			<Wrapper size={size} sizeUnit={sizeUnit}>
				{getBalls({
					countBalls,
					frontColor,
					backColor,
					size,
					sizeUnit,
				})}
			</Wrapper>
		) : <></>
	);
};


ImpulseSpinner.defaultProps = defaultProps

export default ImpulseSpinner
