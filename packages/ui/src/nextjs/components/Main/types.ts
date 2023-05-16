import type { ReactElement } from 'react'
import type { Dispatch, SetStateAction } from "react"


export interface MainProviderOptions {
	children: ReactElement;
	defaults: {
		isAnimationsActive: boolean
	}
}

export interface MainDataType {
	isMobile: boolean
	isTouchable: boolean
	scrollDirection: 'up' | 'down' | undefined
	appBarState: boolean
	appBarOpts: AppBarOptions
	sideBarState: boolean
	sideBarOpts: SideBarOptions
	overlayState: boolean
	isAnimationsActive: boolean | undefined
}

export interface MainContextType extends MainDataType {
	setAppBarState: Dispatch<SetStateAction<boolean>>
	setAppBarOpts: Dispatch<SetStateAction<AppBarOptions>>
	setSideBarState: Dispatch<SetStateAction<boolean>>
	setSideBarOpts: Dispatch<SetStateAction<SideBarOptions>>
	setOverlayState: Dispatch<SetStateAction<boolean>>
	setIsAnimationsActive: Dispatch<SetStateAction<boolean | undefined>>
}

export interface AppBarOptions {
	height: number
}

export interface SideBarOptions {
	width: number;
	shrinkPoint: number;
}
