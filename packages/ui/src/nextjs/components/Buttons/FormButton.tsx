"use client";
import { CSSProperties, useEffect, useRef } from "react"

import { css } from "@emotion/css"
import styled from "@emotion/styled"
import autoAnimate from "@formkit/auto-animate"
import clsx from "clsx"
import { motion, type HTMLMotionProps } from "framer-motion"
import tw from "twin.macro"

import HelperText from "../Form/HelperText"
import Button, { type ButtonProps } from "./Button"
import { shouldForwardProp } from "../../utils/StyledUtils";
import { withTheme } from "@emotion/react"


interface ButtonWrapperProps {
	centered?: boolean
}

interface FormButtonProps extends ButtonProps {
	helperText?: string
	error?: boolean
	centered?: boolean
}

const ButtonWrapper = styled(motion.div, {
	shouldForwardProp: (props) => shouldForwardProp<ButtonWrapperProps>(
		[
			"centered",
		]
	)(props as keyof ButtonWrapperProps)
})(({ centered }: { centered?: boolean }) => [
	tw`flex flex-col w-full`,
	centered && tw`items-center`,
])

const FormButton = ({
	centered = true,
	error = false,
	helperText = "",
	className,
	dark,
	children,
	...restProps
}: FormButtonProps & HTMLMotionProps<"button">) => {

	const buttonWrapperRef = useRef(null)

	useEffect(() => {
		buttonWrapperRef.current && autoAnimate(buttonWrapperRef.current)
	}, [buttonWrapperRef])

	return (
		<ButtonWrapper {...{ dark, centered }} ref={buttonWrapperRef}>
			{
				helperText ? (
					<HelperText className="text-center" {...{ error }}>
						{helperText}
					</HelperText>
				) : null
			}
			<Button {...restProps}
			        {...{ dark }}
				// TODO: fix this
				    className={`${
					    css`
						    ${helperText ? tw`!mt-0` : tw`!mt-6`}
					    `} ${clsx(className)}`}
				    type="submit">
				{children}
			</Button>
		</ButtonWrapper>
	)
}

export default withTheme(ButtonWrapper)
