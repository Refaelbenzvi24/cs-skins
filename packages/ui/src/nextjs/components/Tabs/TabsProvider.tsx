import { TabContextType, TabsContext } from "./TabsContext"
import type { ReactNode } from "react"
import { useState } from "react"

interface TabsProviderProps {
	children: ReactNode
}

const TabsProvider = ({ children, ...props }: TabsProviderProps) => {
	const [tabs, setTabs] = useState<TabContextType[]>([])

	const registerTab = (tab: TabContextType) => {
		setTabs([...tabs, tab])
	}

	const unregisterTab = (tabId: string) => {
		setTabs(tabs.filter((t) => t.id !== tabId))
	}

	return (
		<TabsContext.Provider value={{ tabs, registerTab, unregisterTab }}>
			{children}
		</TabsContext.Provider>
	)
}

export default TabsProvider
