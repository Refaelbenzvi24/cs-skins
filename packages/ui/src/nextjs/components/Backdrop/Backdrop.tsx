"use client";
import clsx from "clsx"
import { AnimatePresence, motion, type HTMLMotionProps } from "framer-motion"

import StyledBackdrop from "./StyledBackdrop"
import { withTheme } from "@emotion/react"


export interface StyledBackdropProps {
	dark?: boolean,
	noBackground?: boolean
}



export interface BackdropProps extends StyledBackdropProps {
	active: boolean
	animationTime?: number
}

const Backdrop = ({ active, className, animationTime = 0.4, ...restProps }: BackdropProps & HTMLMotionProps<"div">) => {
	return (
		<AnimatePresence>
			{active ? (
				<StyledBackdrop
					{...restProps}

					initial={{
						opacity: 0,
					}}
					transition={{
						duration: animationTime,
					}}
					animate={{
						opacity: 0.3,
					}}
					exit={{
						opacity: 0,
					}}
					className={`${clsx(className)}`}/>
			) : null}
		</AnimatePresence>
	)
}

export default withTheme(Backdrop)
