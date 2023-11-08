import styled from "@emotion/styled"
import { motion } from "framer-motion"
import tw from "twin.macro"
import { shouldForwardProp } from "../../Utils/StyledUtils"
import { css } from "@emotion/react"

interface TabsWrapperProps {

}

const TabsWrapper = styled(motion.div, {
	shouldForwardProp: (props) => shouldForwardProp<TabsWrapperProps>(
		[]
	)(props as keyof TabsWrapperProps)
})(({}: TabsWrapperProps) => [
	css`
		${tw`flex flex-row space-x-4 justify-center items-center`};
		z-index: 2;
	`
])

export default TabsWrapper
