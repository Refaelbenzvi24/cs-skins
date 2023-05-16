import {HTMLMotionProps, motion} from "framer-motion";
import styled from "@emotion/styled";
import {css} from "@emotion/react";
import {shouldForwardProp} from "../../Utils/StyledUtils";
import theme from "../../Utils/theme";
import {ColorsForState} from "../Buttons/Button";
import {useEffect, useRef} from "react";

interface StyledTableRowProps {
	height?: string
	width?: string
	clickable?: boolean
	colorsForState?: ColorsForState
	colorsForStateDark?: ColorsForState
	dark?: boolean
}

// const transition = {type: 'spring', stiffness: 500, damping: 50, mass: 1}

const StyledTableRow = styled(motion.tr, {
	shouldForwardProp: (props) => shouldForwardProp<StyledTableRowProps>(
		[
			"height",
			"width",
			"clickable",
			"colorsForState",
			"colorsForStateDark",
			"dark",
		]
	)(props as keyof StyledTableRowProps)
})(({
	    height = "auto",
	    width,
	    colorsForState = theme.colorSchemeByState.accent,
	    colorsForStateDark = theme.colorSchemeByState.overlaysDark,
	    clickable,
	    dark
    }: StyledTableRowProps) => [
	css`
    outline: 0;
    background-color: ${colorsForState!.default};
	`,
	
	clickable && css`
    &:hover {
      cursor: pointer;
      background-color: ${colorsForState!.hover};
    }

    &:focus {
      background-color: ${colorsForState!.hover};
    }

    &:active {
      background-color: ${colorsForState!.active};
    }

    &:disabled {
      background-color: ${colorsForState!.lightDisabled};

      & > * {
        color: ${colorsForStateDark!.lightDisabledText};
      }
    }
	`,
	
	height && css`
    height: ${height};
	`,
	
	width && css`
    width: ${width};
	`,
	
	(props) => (dark || props.theme.isDark) && css`
    background-color: ${colorsForStateDark!.default};

    ${clickable && css`
      &:hover {
        cursor: pointer;
        background-color: ${colorsForStateDark!.hover};
      }

      &:focus {
        background-color: ${colorsForStateDark!.hover};
      }

      &:active {
        background-color: ${colorsForStateDark!.active};
      }

      &:disabled {
        background-color: ${colorsForStateDark!.darkDisabled};

        & > * {
          color: ${colorsForStateDark!.darkDisabledText};
        }
      }
    `}
	`,
])

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

export default TableRow
