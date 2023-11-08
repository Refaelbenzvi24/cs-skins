"use client";
import styled from "@emotion/styled"
import { HTMLMotionProps, motion } from "framer-motion"
import tw from "twin.macro"
import { withTheme } from "@emotion/react"
import { shouldForwardProp } from "../../Utils/StyledUtils"
import { useTabs } from "./TabsContext"
import { useEffect, useMemo, useRef } from "react"
import _ from "lodash"

interface TabProps {

}


const StyledTab = styled(motion.a, {
	shouldForwardProp: (props) => shouldForwardProp<TabProps>(
		[]
	)(props as keyof TabProps)
})(() => [
	tw`cursor-pointer z-[11] !bg-transparent w-full`,
])

const Tab = (props: TabProps & HTMLMotionProps<"a">) => {
	const tabId = useRef(_.uniqueId())
	const { registerTab, unregisterTab } = useTabs()

	useEffect (() => {
		registerTab({
			id: tabId.current,

		})
		return () => {
			unregisterTab(tabId.current)
		};
	}, []);


	return (
		<StyledTab {...props} />
	)
}

export default withTheme(Tab)
