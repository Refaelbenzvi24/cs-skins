import {useRef, type ComponentProps} from "react"

import {css} from "@emotion/css"
import {motion} from "framer-motion"
import tw from "twin.macro"

import {theme, Typography} from '../../index'
import type {ButtonProps} from "../Buttons/Button"
import type Link from "next/link"
import LinkButton from "../Buttons/LinkButton";


type MotionButtonProps = ButtonProps & ComponentProps<typeof Link>

interface NavigationItemProps extends MotionButtonProps {
	label: string
	value: string
	selected: { label: string, value: string } | undefined
}

const NavigationItem = (props: NavigationItemProps) => {
	const {label, value, selected, ...restProps} = props
	
	const buttonRef = useRef(null)
	
	return (
		<LinkButton
			ref={buttonRef}
			className={`${css`
        ${tw`cursor-pointer relative`};

        div {
          transition: width 350ms ease-in-out;
        }

        &:hover div {
          width: 100% !important;
        }
			`}`}
			noPadding
			colorsForStates={theme.colorSchemeByState.primary}
			text
			{...restProps}>
			<div className="absolute w-full bottom-0">
				<motion.div
					initial={{
						translateY: 8,
						width: 0,
					}}
					animate={(selected?.value === value) ? {
						width: '100%',
					} : {width: 0}}
					transition={{
						duration: 0.35,
					}}
					className={css`
            bottom: -2px;
            height: 3px;
            background-color: ${theme.colorScheme.primary};
					`}/>
			</div>
			
			
			<Typography
				className="whitespace-nowrap"
				color={theme.colorScheme.primary}
				variant="preTitle">
				{label}
			</Typography>
		</LinkButton>
	)
}

export default NavigationItem
