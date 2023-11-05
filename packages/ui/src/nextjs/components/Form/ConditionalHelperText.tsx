"use client";
import HelperText, { type HelperTextProps } from "./HelperText"
import { withTheme } from "@emotion/react"
import { AnimatePresence, motion } from "framer-motion"
import { Typography } from "../../index"


interface ConditionalHelperTextProps extends HelperTextProps {
	children?: React.ReactNode
	condition?: boolean
}

const ConditionalLabel = ({ children, condition, ...restProps }: ConditionalHelperTextProps) => {
	return (
		<HelperText {...restProps}>
			<AnimatePresence initial={false}>
				{!!(condition) && (
					<motion.span
						initial={{
							opacity: 0
						}}
						animate={{
							opacity: 1
						}}
						exit={{
							opacity: 0
						}}>
						{children}
					</motion.span>
				)}
			</AnimatePresence>
		</HelperText>
	)
}


export default withTheme (ConditionalLabel)
