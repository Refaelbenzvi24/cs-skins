'use client'
import { createContext, useContext } from "react"

export interface TabContextType {
	id: string
}

export interface TabsContextType {
	tabs: TabContextType[]
	registerTab: (tab: TabContextType) => void
	unregisterTab: (tabId: string) => void
}

export const TabsContext = createContext<TabsContextType>({} as TabsContextType)

export const useTabs = () => useContext(TabsContext)
