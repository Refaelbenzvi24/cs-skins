import {CSSProperties, useEffect, useRef} from "react"

import {css} from "@emotion/css"
import styled from "@emotion/styled"
import autoAnimate from "@formkit/auto-animate"
import clsx from "clsx"
import {motion, type HTMLMotionProps} from "framer-motion"
import tw from "twin.macro"

import HelperText from "../Form/HelperText"
import Button, {type ButtonProps} from "./Button"
import {shouldForwardProp} from "../../Utils/StyledUtils";


interface FormButtonProps extends ButtonProps {
	helperText?: string
	error?: boolean
	centered?: boolean
}

const ButtonWrapper = styled(motion.div, {
	shouldForwardProp: (props) => shouldForwardProp<FormButtonProps>(
		[
			"dark",
			"color",
			"fab",
			"icon",
			"height",
			"width",
			"size",
			"text",
			"noShadow",
			"elevation",
			"bgColor",
			"colorsForStates",
			"helperText",
			"error",
			"centered",
		]
	)(props as keyof FormButtonProps)
})(({centered}: { centered?: boolean }) => [
	tw`flex flex-col w-full`,
	centered && tw`items-center`,
])

const FormButton = (props: FormButtonProps & HTMLMotionProps<"button">) => {
	const {className, helperText, error, dark, centered, children, ...restProps} = props
	
	const buttonWrapperRef = useRef(null)
	
	useEffect(() => {
		buttonWrapperRef.current && autoAnimate(buttonWrapperRef.current)
	}, [buttonWrapperRef])
	
	return (
		<ButtonWrapper {...{dark, centered}} ref={buttonWrapperRef}>
			{
				helperText ? (
					<HelperText className="text-center" {...{error}}>
						{helperText}
					</HelperText>
				) : null
			}
			<Button {...restProps}
			        {...{dark}}
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

FormButton.defaultProps = {
	centered: true,
	error: false,
	helperText: '',
}

export default FormButton
