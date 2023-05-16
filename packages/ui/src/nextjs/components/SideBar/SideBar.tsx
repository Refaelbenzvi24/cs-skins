import {useEffect} from 'react'

import {css} from "@emotion/react"
import styled from "@emotion/styled"
import clsx from 'clsx'
import {motion, type HTMLMotionProps} from "framer-motion"
import tw from "twin.macro"

import {defaultMainData} from '../Main/MainContext'
import theme from "../../Utils/theme"
import {transformTransition} from "../../Utils/transitions"
import {conditionalTranslate} from "../../Utils/utils"
import useDimensions from "../../hooks/useDimensions";
import {useMain} from "../../index";
import {shouldForwardProp} from "../../Utils/StyledUtils";

interface StyledSideBarProps {
	dark?: boolean
	width: number
	state?: boolean
	bgColor?: string
	bgColorDark?: string
}

const {sideBarOpts: defaultSideBarOptions} = defaultMainData
const {width: defaultWidth, shrinkPoint: defaultShrinkPoint} = defaultSideBarOptions

const defaultProps = {
	dark: undefined,
	width: defaultWidth,
	shrinkPoint: defaultShrinkPoint,
	bgColor: theme.colorScheme.white,
	bgColorDark: theme.colorScheme.overlaysDark
}

const StyledSideBar = styled(motion.nav, {
	shouldForwardProp: (props) => shouldForwardProp<StyledSideBarProps>(
		['dark', 'width', 'state', 'bgColor', 'bgColorDark']
	)(props as keyof StyledSideBarProps)
})(({dark, bgColor, bgColorDark, width, state}: StyledSideBarProps) => [
	css`
    z-index: ${theme.zIndex.sideBar};
    background-color: ${bgColor};
    width: ${width}px;
	`,
	
	(props) => (dark || props.theme.isDark) && css`
    background-color: ${bgColorDark};
	`,
	
	tw`fixed h-full shadow-lg`,
	theme.transitions([transformTransition()]),
	theme.transforms([conditionalTranslate(!state, `-100%`, 'ltr')]),

])


interface SideBarProps extends HTMLMotionProps<"nav"> {
	shrinkPoint?: number
}

const SideBar = (props: SideBarProps & Omit<StyledSideBarProps, 'state'> & typeof defaultProps) => {
	const {sideBarState: state, setSideBarState: setState, setSideBarOpts, setOverlayState} = useMain()
	
	const {dark, children, width, className, shrinkPoint, ...restProps} = props
	
	const {windowWidth} = useDimensions()
	
	useEffect(() => {
		setSideBarOpts({
			shrinkPoint,
			width,
		})
	}, [shrinkPoint, width])
	
	
	useEffect(() => {
		const setOpenState = (state: boolean) => {
			setState(state)
			
			if (shrinkPoint && windowWidth && windowWidth < shrinkPoint && state) {
				setOverlayState(true)
				return
			}
			
			setOverlayState(false)
		}
		
		const initializeOpenState = () => {
			if (shrinkPoint && windowWidth && windowWidth > shrinkPoint) return setOpenState(true)
			setOpenState(false)
		}
		
		initializeOpenState()
	}, [setOverlayState, setState, shrinkPoint, windowWidth])
	
	return (
		<StyledSideBar id="sideBar"
		               dark={dark}
		               width={width}
		               state={state}
		               className={clsx(className)}
		               {...restProps}>
			{children}
		</StyledSideBar>
	)
}


SideBar.defaultProps = defaultProps

export default SideBar
