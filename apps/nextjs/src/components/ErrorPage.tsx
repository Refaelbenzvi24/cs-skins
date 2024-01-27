import type { ErrorComponentProps } from "~/components/errors";
import errorCodesComponentsMap from "~/components/errors"


const ErrorPage = (error: ErrorComponentProps) => {
	const ErrorComponent = errorCodesComponentsMap[error?.code]
	if (!ErrorComponent) return <div>Unknown error</div>
	return (
		<ErrorComponent {...error}/>
	)
}

export default ErrorPage
