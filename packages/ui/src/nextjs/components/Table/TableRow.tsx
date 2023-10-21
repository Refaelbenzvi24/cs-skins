"use client";
import {HTMLMotionProps} from "framer-motion";
import {useEffect, useRef} from "react";
import StyledTableRow, { StyledTableRowProps } from "./StyledTableRow"
import { withTheme } from "@emotion/react"

interface TableRowProps {
	autoFocus?: boolean
}

const TableRow = (props: HTMLMotionProps<"tr"> & StyledTableRowProps & TableRowProps) => {
	const {children, autoFocus, ...restProps} = props

	const tableRowRef = useRef<HTMLTableRowElement>(null)

	useEffect(() => {
		if (tableRowRef.current && props.clickable && props.autoFocus) tableRowRef.current.focus()
	}, [tableRowRef, props.clickable, props.autoFocus])

	// const [isPresent, safeToRemove] = usePresence()
	//
	// const animations = {
	// 	layout: true,
	// 	initial: 'out',
	// 	style: {
	// 		color: '#9f3030',
	// 		position: isPresent ? 'static' : 'absolute'
	// 	},
	// 	animate: isPresent ? 'in' : 'out',
	// 	whileTap: 'tapped',
	// 	variants: {
	// 		in: {scaleY: 1, opacity: 1, color: '#fff'},
	// 		out: {scaleY: 0, opacity: 0, zIndex: -1, color: '#000'},
	// 		tapped: {scale: 0.98, opacity: 0.5, transition: {duration: 0.1}}
	// 	},
	// 	onAnimationComplete: () => !isPresent && safeToRemove(),
	// 	transition
	// }

	return (
		<StyledTableRow
			initial={{
				opacity: 0
			}}
			animate={{
				opacity: 1
			}}
			exit={{
				opacity: 0
			}}
			transition={{
				duration: 0.25
			}}
			tabIndex={props.clickable ? 0 : undefined}
			{...restProps}
			ref={tableRowRef}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault()
					props.onClick?.(e as any)
				}
				if (props.onKeyDown) props.onKeyDown(e as any)
			}}>
			{children}
		</StyledTableRow>
	)
}

export default withTheme(TableRow)
