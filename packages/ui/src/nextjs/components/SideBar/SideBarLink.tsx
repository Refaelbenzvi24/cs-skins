"use client";
import React from "react";
import styled from "@emotion/styled"
import clsx from "clsx"
import { motion, HTMLMotionProps } from "framer-motion"
import tw, { css } from "twin.macro"
import { shouldForwardProp } from "../../Utils/StyledUtils";
import { useMain } from "../../index";
import useDimensions from "../../hooks/useDimensions";
import { withTheme } from "@emotion/react"

interface LinkWrapperProps {
	dir?: string
}

const LinkWrapper = styled (motion.div, {
	shouldForwardProp: (props) => shouldForwardProp<LinkWrapperProps> (
		["dir"]
	) (props as keyof LinkWrapperProps)
}) (({ dir }: LinkWrapperProps) => [
	tw`px-6 cursor-pointer block font-semibold
	dark:hover:(bg-gray-100/[0.1]) dark:focus:bg-gray-600
	hover:(bg-gray-100/[0.1]) focus:bg-gray-200 focus:outline-none`,

	css`
      * {
        ${(dir === "ltr") && tw`hover:translate-x-2`}
        ${(dir === "rtl") && tw`hover:(-translate-x-2)`}
        ${tw`block px-2 py-1.5 transform transition-transform ease-in duration-200 opacity-100`}
      }
	`,
])

interface LinkButtonProps {
	dir?: "lrt" | "rtl"
}

const LinkButton = (props: LinkButtonProps & HTMLMotionProps<"div">) => {
	const { children, className, onClick, ...rest } = props

	const { setSideBarState, sideBarOpts } = useMain ()
	const { windowWidth } = useDimensions ()


	return (
		<LinkWrapper className={clsx (className)}
		             {...rest}
		             onClick={(event) => {
			             if (windowWidth && windowWidth <= sideBarOpts.shrinkPoint) setSideBarState (false)
			             if (onClick) onClick (event)
		             }}>
			{children}
		</LinkWrapper>
	)
}

export default withTheme (LinkButton)

