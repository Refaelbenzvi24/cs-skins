"use client";
import { css, withTheme } from "@emotion/react"
import styled from "@emotion/styled"
import clsx from "clsx"
import { motion } from "framer-motion"
import { default as Link, type LinkProps } from "next/link"
import tw from "twin.macro"

import theme from "../../utils/theme"
import { type ReactNode } from "react";


const CardLinkWrapper = styled (motion.div) (({ dir, dark }: { dir?: "ltr" | "rtl", dark?: boolean }) => [
	tw`flex flex-row items-center w-full px-4 py-2 mt-2 text-sm font-semibold rounded-lg md:block`,

	dir === "rtl" && tw`text-right`,
	dir === "ltr" && tw`text-left`,

	css`
      background-color: transparent;

      &:hover {
        background-color: ${theme.colors.gray_200};
        color: ${theme.colors.gray_900};
      }

      &:focus {
        ${tw`outline-none`}

        background-color: ${theme.colors.gray_200};
        color: ${theme.colors.gray_900};
      }
	`,
	(props) => (dark || props.theme.isDark) && css`
      &:focus {
        background-color: ${theme.colors.gray_600};
        color: ${theme.colors.white};
      }

      &:hover {
        background-color: ${theme.colors.gray_600};
        color: ${theme.colors.white};
      }
	`,
])

interface CardLinkProps extends LinkProps {
	className?: string | undefined
	children?: ReactNode | ReactNode[]
	dark?: boolean
	dir?: "ltr" | "rtl"
}


const CardLinkButton = ({
	                        children,
	                        className,
	                        dir,
	                        dark,
	                        ...restProps
                        }: CardLinkProps) => {
	return (
		<CardLinkWrapper {...{ dir, dark }} className={clsx (className)}>
			<Link {...restProps}>
				{children}
			</Link>
		</CardLinkWrapper>
	)
}

export default withTheme(CardLinkButton)
