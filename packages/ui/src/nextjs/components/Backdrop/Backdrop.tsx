import { css } from "@emotion/react"
import styled from "@emotion/styled"
import clsx from "clsx"
import { AnimatePresence, motion, type HTMLMotionProps } from "framer-motion"
import tw from "twin.macro"

import theme from "../../Utils/theme"
import { shouldForwardProp } from "../../Utils/StyledUtils"


export interface StyledBackdropProps {
	dark?: boolean,
	noBackground?: boolean
}

const StyledBackdrop = styled(motion.div, {
	shouldForwardProp: (props) => shouldForwardProp<StyledBackdropProps>(
		['dark', 'noBackground']
	)(props as keyof StyledBackdropProps)
})(({ dark, noBackground }: StyledBackdropProps) => [
	tw`fixed h-full w-full opacity-0 !cursor-default`,

	!noBackground && css`
		background-color: ${theme.colors.dark_200};
	`,

	css`
		z-index: ${theme.zIndex.backdrop};
	`,

	(props) => ((dark || props.theme.isDark) && !noBackground) && css`
		background-color: ${theme.colors.dark_800};
	`,
])

export interface BackdropProps extends StyledBackdropProps {
	active: boolean
	animationTime?: number
}

const Backdrop = ({ active, className, animationTime, ...restProps }: BackdropProps & HTMLMotionProps<"div">) => {
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

Backdrop.defaultProps = {
	dark:          undefined,
	animationTime: 0.4,
}

export default Backdrop
