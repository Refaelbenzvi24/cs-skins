import { Col, Typography } from "@acme/ui"


export interface ErrorInfoProps {
	errorId: string;
	timestamp: string;
	errorCode: string;
}

const ErrorInfo = ({ errorCode, errorId, timestamp }: ErrorInfoProps) => {
	return (
		<Col className="pt-4">
			<Typography dir="ltr" variant="body" color="colorScheme.subtitle1">
				ID: {errorId}
			</Typography>
			<Typography dir="ltr" variant="body" color="colorScheme.subtitle1">
				tmstmp: {timestamp}
			</Typography>
			<Typography dir="ltr" variant="body" color="colorScheme.subtitle1">
				Code: {errorCode}
			</Typography>
		</Col>
	)
}

export default ErrorInfo
