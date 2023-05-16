import {motion} from "framer-motion"

import styled from "@emotion/styled"
import {buttonDefaultProps, ButtonStyles, type ButtonProps, buttonPropsArray} from "./Button";
import {shouldForwardProp} from "../../Utils/StyledUtils";

const ATagButton = styled(motion.a, {
	shouldForwardProp: (props) => shouldForwardProp<ButtonProps>(
		buttonPropsArray
	)(props as keyof ButtonProps)
})(ButtonStyles)

ATagButton.defaultProps = buttonDefaultProps

export default ATagButton
