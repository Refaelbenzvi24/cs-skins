"use client";
import styled from "@emotion/styled"
import { AnimatePresence } from "framer-motion"
import tw from "twin.macro"
import { css, withTheme } from "@emotion/react"
import { shouldForwardProp } from "../../utils/StyledUtils"
import { ReactNode } from "react"

import clsx from "clsx"
import ActiveTabIndicator from "./ActiveTabIndicator"
import Link, { LinkProps } from "next/link"


interface TabProps {
	isActive?: boolean
	activeTabIndex?: number
	index?: number
	lastActiveTabIndex?: number
}


const StyledTab = styled(Link, {
	shouldForwardProp: (props) => shouldForwardProp<TabProps>(
		["isActive", "index", "activeTabIndex", "lastActiveTabIndex"]
	)(props as keyof TabProps)
})(() => [
	tw`relative flex cursor-pointer z-[11] !bg-transparent w-full h-full`,

	css`
		& > span {
			z-index: -1;
		}
	`
])

const Tab = (
	{
		children,
		className,
		index,
		isActive,
		activeTabIndex,
		lastActiveTabIndex,
		...restProps
	}: TabProps
	   & Omit<React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, 'ref'>
	   & LinkProps
	   & { children?: ReactNode }) => {
	return (
		<StyledTab className={clsx(className)} {...restProps}>
			{children}
			<AnimatePresence initial={false}>
				{isActive && (
					<ActiveTabIndicator
						initial={{
							opacity:    1,
							translateX: `${(lastActiveTabIndex! - index!) * 100}%`,
						}}
						animate={{
							opacity:    1,
							translateX: 0,
						}}/>
				)}
			</AnimatePresence>
		</StyledTab>
	)
}

export default withTheme(Tab)
