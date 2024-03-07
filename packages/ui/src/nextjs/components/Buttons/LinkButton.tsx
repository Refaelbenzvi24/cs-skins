"use client";
import Link from "next/link"
import styled from "@emotion/styled"
import {buttonPropsArray, ButtonStyles, type ButtonProps} from "./Button"
import {shouldForwardProp} from "../../utils/StyledUtils";
import { withTheme } from "@emotion/react"


const LinkButton = styled(Link, {
	shouldForwardProp: (props) => shouldForwardProp<ButtonProps>(
		buttonPropsArray
	)(props as keyof ButtonProps)
})(ButtonStyles)

export default withTheme(LinkButton)
