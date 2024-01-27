"use client";
import type { ReactElement } from "react"

import { ErrorBoundary } from "react-error-boundary"


interface ErrorsBoundaryProps {
	children: ReactElement | ReactElement[]
}

const ErrorsBoundary = (props: ErrorsBoundaryProps) => {
	const { children } = props

	const errorHandler = (...args) => {
		console.log({ args })
	}
	// error: any, errorInfo: any

	return (
		<ErrorBoundary fallback={
			<div>
				error
			</div>
		} onError={errorHandler}>
			{children}
		</ErrorBoundary>
	)
}

export default ErrorsBoundary
