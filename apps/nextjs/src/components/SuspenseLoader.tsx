import { LoadingSpinner } from "@acme/ui"
import type { ReactNode} from "react";
import { Suspense } from "react"


const SuspenseLoader = ({children}: {children: ReactNode}) => {
	return (
		<Suspense fallback={
			<div className="flex w-full h-full justify-center items-center">
				<LoadingSpinner/>
			</div>
		}>
			{children}
		</Suspense>
	)
}

export default SuspenseLoader;
