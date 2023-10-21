"use client";
import {motion} from "framer-motion"

import styled from "@emotion/styled"
import {ButtonStyles, type ButtonProps, buttonPropsArray} from "./Button";
import {shouldForwardProp} from "../../Utils/StyledUtils";
import { withTheme } from "@emotion/react"

const ATagButton = styled(motion.a, {
	shouldForwardProp: (props) => shouldForwardProp<ButtonProps>(
		buttonPropsArray
	)(props as keyof ButtonProps)
})(ButtonStyles)


export default withTheme(ATagButton)
