import React from "react"
import {useEffect, useState} from "react"

import {css} from "@emotion/react"
import styled from "@emotion/styled"
import tw from "twin.macro"

import theme from "../../Utils/theme"
import {useMain} from "../../index";
import {motion, type HTMLMotionProps} from "framer-motion"
import useScrollPosition from "../../hooks/useScrollPosition";
import {shouldForwardProp} from "../../Utils/StyledUtils";


export interface AppBarWrapperProps {
	dark?: boolean
	height: number
	backgroundColor: string
	darkBackgroundColor: string
	hasBackground: boolean
}

const AppBarWrapper = styled(motion.div, {
	shouldForwardProp: (props) => shouldForwardProp<AppBarWrapperProps>(
		['height', 'darkBackgroundColor', 'dark', 'hasBackground', 'backgroundColor']
	)(props as keyof AppBarWrapperProps)
})((props: AppBarWrapperProps) => {
	const {height, hasBackground, backgroundColor, darkBackgroundColor, dark} = props
	
	return [
		tw`flex flex-row fixed w-full items-center`,
		
		hasBackground && css`
      background-color: ${backgroundColor};
      box-shadow: 0 6px 8px rgba(0, 0, 0, 0.1);
		`,
		
		css`
      z-index: ${theme.zIndex.appBar};
      transition: all 150ms linear;
      height: ${height}px;
			
			& ~ #main {
        padding-top: ${height}px;
			}
		`,
		
		(props) => (hasBackground && (dark || props.theme.isDark)) && css`
      background-color: ${darkBackgroundColor};
		`
	]
})

const defaultProps = {
	backgroundColor: theme.colorScheme.accent,
	darkBackgroundColor: theme.colorScheme.overlaysDark,
	hideOnScroll: false,
	height: 84,
} as const

export interface AppBarProps extends Omit<AppBarWrapperProps, 'hasBackground'> {
	hideOnScroll?: boolean
}


const AppBar = (props: typeof defaultProps & AppBarProps & HTMLMotionProps<'div'>) => {
	const {children, hideOnScroll, ...restProps} = props
	
	const {setAppBarState, setAppBarOpts, scrollDirection} = useMain()
	const {scrollY} = useScrollPosition()
	
	const [show, setShow] = useState(true)
	const [hasBackground, setHasBackground] = useState<boolean>(false)
	
	
	useEffect(() => {
		const controlAppbar = () => {
			if (hideOnScroll) {
				if (scrollDirection === 'down' && scrollY && scrollY > 20) return setShow(false)
				if (scrollDirection === 'up') return setShow(true)
			}
		}
		
		controlAppbar()
	}, [hideOnScroll, scrollDirection, scrollY])
	
	
	useEffect(() => {
		setHasBackground(() => window.scrollY > 20)
	}, [])
	
	
	useEffect(() => {
		setAppBarState(() => true)
		
		return () => {
			setAppBarState(() => false)
		}
	}, [setAppBarState])
	
	useEffect(() => {
		if (window.scrollY > 20 && show) setHasBackground(true)
		
		if (window.scrollY <= 20 && show) setHasBackground(false)
	}, [show, scrollY])
	
	useEffect(() => {
		setAppBarOpts((prev) => ({
			...prev,
			height: props.height,
		}))
	}, [props.height, setAppBarOpts])
	
	return (
		<AppBarWrapper
			hasBackground={hasBackground}
			animate={{
				translateY: show ? 0 : '-100%',
			}}
			transition={{
				duration: 0.3,
			}}
			{...restProps}
			id="app-bar">
			{children}
		</AppBarWrapper>
	)
}

AppBar.defaultProps = defaultProps

export default AppBar
