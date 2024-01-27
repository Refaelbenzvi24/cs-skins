"use client";
import type { getErrorShape, TRPCErrorWithGenerics } from "@acme/api/src/trpc"
import errorCodesComponentsMap from "~/components/errors"
import TRPCError from "@acme/logger/src/Errors/TRPCError"


const ErrorPage = ({
	error,
}: {
	error: ReturnType<typeof getErrorShape> | TRPCErrorWithGenerics | Error
	reset: () => void
}) => {
	if('data' in error){
		const ErrorComponent = errorCodesComponentsMap[error.data.code]
		return (
			<ErrorComponent message={error.data.message} errorId={error.data.errorId} timestamp={error.data.timestamp} errorCode={error.data.errorCode} code={error.data.code}/>
		)
	}
	if(error instanceof TRPCError){
		const ErrorComponent = errorCodesComponentsMap[error.code]
		return (
			<ErrorComponent message={(error as TRPCErrorWithGenerics).message} errorId={error.errorId} timestamp={error.timestamp} errorCode={(error as TRPCErrorWithGenerics).errorCode} code={error.code}/>
		)
	}
	if(process.env.NODE_ENV === 'development') console.log({ ...error, message: error.message, stack: error?.stack?.split('\n') })
	return <div>Unknown error</div>
}

export default ErrorPage;
