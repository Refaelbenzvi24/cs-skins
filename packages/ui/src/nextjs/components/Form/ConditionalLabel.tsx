"use client";
import Label, { type LabelProps } from "./Label"
import { withTheme } from "@emotion/react"
import { AnimatePresence, motion } from "framer-motion"


interface ConditionalLabelProps extends LabelProps {
	children?: React.ReactNode
	condition?: boolean
}

const ConditionalLabel = ({ children, condition, ...restProps }: ConditionalLabelProps) => {
	return (
		<Label {...restProps}>
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
		</Label>
	)
}


export default withTheme (ConditionalLabel)
