"use client";
import { useEffect, useState } from "react"

import UAParser from "ua-parser-js"

import { defaultMainData, MainContext } from "./MainContext"
import type { MainProviderOptions } from "./types"
import LocalStorage from "@acme/localstorage"
import useDimensions from "../../hooks/useDimensions";


let lastScrollY = 0

const {
	appBarState:  defaultAppBarState,
	appBarOpts:   defaultAppBarOptions,
	sideBarState: defaultSideBarState,
	sideBarOpts:  defaultSideBarOptions,
	overlayState: defaultOverlayState,
} = defaultMainData

const getIsAnimationActive = (defaultValue: boolean) => {
	const isAnimationActive = LocalStorage.getIsAnimationsActive ()

	if (isAnimationActive !== null) return isAnimationActive

	LocalStorage.setIsAnimationsActive (defaultValue)

	return defaultValue
}


const MainProvider = (props: MainProviderOptions) => {
	const { children, defaults, language = "en", dir = "ltr", translationFunction = (key: string) => key } = props

	const [isServer, setIsServer] = useState<boolean> (true)
	const [appBarState, setAppBarState] = useState (defaultAppBarState)
	const [appBarOptions, setAppBarOptions] = useState (defaultAppBarOptions)
	const [sideBarState, setSideBarState] = useState (defaultSideBarState)
	const [overlayState, setOverlayState] = useState (defaultOverlayState)
	const [sideBarOptions, setSideBarOptions] = useState (defaultSideBarOptions)
	const [isAnimationsActive, setIsAnimationsActive] = useState<boolean> ()
	const [isMobile, setIsMobile] = useState<boolean> (false)
	const [isTouchable, setIsTouchable] = useState<boolean> (false)
	const [scrollDirection, setScrollDirection] = useState<"up" | "down"> ()

	const isTouchListener = () => setIsTouchable (() => true)
	const { windowHeight, windowWidth } = useDimensions ()

	useEffect (() => {
		const scrollDirectionHandler = () => {
			const currentScrollDirection = window.scrollY > lastScrollY ? "down" : window.scrollY < lastScrollY ? "up" : undefined
			if (scrollDirection !== currentScrollDirection) setScrollDirection (() => currentScrollDirection)
			lastScrollY = window.scrollY
		}

		setIsAnimationsActive (getIsAnimationActive (defaults.isAnimationsActive))

		window.addEventListener ("touchstart", isTouchListener)
		window.addEventListener ("scroll", scrollDirectionHandler)

		return () => {
			window.removeEventListener ("touchstart", isTouchListener)
			window.removeEventListener ("scroll", scrollDirectionHandler)
		}
	}, [defaults.isAnimationsActive])

	const initializeIsMobile = () => {
		const userAgent = new UAParser (window.navigator.userAgent).getResult ()

		setIsMobile (userAgent.device.type === "mobile" || userAgent.device.type === "tablet")
	}

	useEffect (() => {
		setIsTouchable (() => false)
		initializeIsMobile ()
	}, [windowHeight, windowWidth])

	useEffect (() => {
		setIsServer (() => false)
	}, [])

	return (
		<MainContext.Provider value={
			{
				isServer,
				isMobile,
				isTouchable,
				scrollDirection,
				appBarState,
				setAppBarState,
				appBarOpts:     appBarOptions,
				setAppBarOpts:  setAppBarOptions,
				sideBarState,
				setSideBarState,
				sideBarOpts:    sideBarOptions,
				setSideBarOpts: setSideBarOptions,
				overlayState,
				setOverlayState,
				isAnimationsActive,
				setIsAnimationsActive,
				language:       language,
				dir:            dir,
				t:              translationFunction
			}
		}>
			{children}
		</MainContext.Provider>
	)
}

export default MainProvider
