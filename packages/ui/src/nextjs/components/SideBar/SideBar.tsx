"use client";
import {useEffect} from 'react'

import { css, withTheme } from "@emotion/react"
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
import StyledSideBar, { StyledSideBarProps } from "./StyledSideBar"

const {sideBarOpts: defaultSideBarOptions} = defaultMainData
const {width: defaultWidth, shrinkPoint: defaultShrinkPoint} = defaultSideBarOptions

interface SideBarProps extends HTMLMotionProps<"nav"> {
	shrinkPoint?: number
}

const SideBar = (
	{
		width = defaultWidth,
		shrinkPoint = defaultShrinkPoint,
		bgColor = theme.colorScheme.white,
		bgColorDark = theme.colorScheme.overlaysDark,
		dark,
		children,
		className,
		...restProps
	}: SideBarProps & Omit<StyledSideBarProps, 'state'>) => {
	const {sideBarState: state, setSideBarState: setState, setSideBarOpts, setOverlayState} = useMain()

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

export default withTheme(SideBar)
