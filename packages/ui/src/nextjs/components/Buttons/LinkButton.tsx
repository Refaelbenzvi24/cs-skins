import Link from "next/link"
import styled from "@emotion/styled"
import {buttonDefaultProps, buttonPropsArray, ButtonStyles, type ButtonProps} from "./Button"
import {shouldForwardProp} from "../../Utils/StyledUtils";


const LinkButton = styled(Link, {
	shouldForwardProp: (props) => shouldForwardProp<ButtonProps>(
		buttonPropsArray
	)(props as keyof ButtonProps)
})(ButtonStyles)

LinkButton.defaultProps = {
	...buttonDefaultProps
}

export default LinkButton
