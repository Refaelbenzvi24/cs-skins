import { Typography } from "@acme/ui"


const UnknownError = () => {
	return (
		<div className="flex flex-row justify-center items-center h-full w-full">
			<Typography variant="h1" color="colorScheme.error" colorDark="colorScheme.error">
				Unknown error
			</Typography>
		</div>
	)
}

export default UnknownError
