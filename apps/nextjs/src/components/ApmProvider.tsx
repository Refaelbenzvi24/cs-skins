"use client";
import { createContext, useContext } from "react"


interface ApmContextType {
	transactionId?: string
	traceId?: string
	spanId?: string
}

export const ApmContext = createContext<ApmContextType>({} as ApmContextType)

export const useApm = () => useContext(ApmContext)

interface ApmProviderProps extends ApmContextType {
	children: React.ReactNode
}

const ApmProvider = ({ children, traceId, transactionId, spanId }: ApmProviderProps) => {
	return (
		<ApmContext.Provider value={{ traceId, transactionId, spanId }}>
			{children}
		</ApmContext.Provider>
	)
}

export default ApmProvider
